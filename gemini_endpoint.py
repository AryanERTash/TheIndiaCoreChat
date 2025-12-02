import os
import asyncio
import json
from urllib.parse import unquote
from fastapi import FastAPI, Query, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from pydantic import BaseModel
from dotenv import load_dotenv

# SlowAPI (in-memory rate limiting)
from slowapi import Limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# LangChain Gemini
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage


# ─────────────────────────────────────────────
# Load API key
# ─────────────────────────────────────────────
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in .env")

MODEL = "gemini-2.5-flash-lite"

SYSTEM_PROMPT = "You are a helpful assistant. Reply in Markdown format."


# ─────────────────────────────────────────────
# FastAPI setup
# ─────────────────────────────────────────────
app = FastAPI(title="Gemini Chat API", version="1.2")

# Rate limiting (in-memory)
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["5/minute"]
)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.add_exception_handler(
    RateLimitExceeded,
    lambda r, e: JSONResponse(
        status_code=200,
        content={"success": False, "error": "rate limit exceeded", "response": None}
    )
)

# gzip compression
app.add_middleware(GZipMiddleware, minimum_size=500)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Security headers
# ─────────────────────────────────────────────
class SecureHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

app.add_middleware(SecureHeadersMiddleware)


# ─────────────────────────────────────────────
# Response Schema
# ─────────────────────────────────────────────
class ChatResponse(BaseModel):
    success: bool
    error: str | None = None
    response: str | None = None


def format_error(msg: str):
    return JSONResponse(
        status_code=200,
        content=ChatResponse(success=False, error=msg, response=None).model_dump()
    )


# ─────────────────────────────────────────────
# Timeout wrapper
# ─────────────────────────────────────────────
async def run_with_timeout(awaitable, timeout_sec=20):
    try:
        return await asyncio.wait_for(awaitable, timeout=timeout_sec)
    except asyncio.TimeoutError:
        return "TIMEOUT"
    except Exception:
        raise


# ─────────────────────────────────────────────
# Chat Endpoint — WITH CONVERSATION HISTORY
# ─────────────────────────────────────────────
@app.get("/chat", response_model=ChatResponse)
@limiter.limit("50/minute")
async def chat(
    request: Request,
    q: str = Query(..., min_length=1),
    sys: str = Query(None, description="Dynamic system prompt"),
    history: str = Query(None, description="URL-encoded JSON conversation history")
):
    try:
        # Choose system prompt (dynamic or default)
        system_prompt = sys if sys else SYSTEM_PROMPT

        # Parse conversation history
        conversation_history = []
        if history:
            try:
                # Decode URL-encoded JSON string
                decoded_history = unquote(history)
                # Parse JSON to array
                history_array = json.loads(decoded_history)
                
                # Convert to LangChain message format
                for msg in history_array:
                    if msg.get("role") == "user":
                        conversation_history.append(HumanMessage(content=msg.get("content", "")))
                    elif msg.get("role") == "assistant":
                        conversation_history.append(AIMessage(content=msg.get("content", "")))
            except (json.JSONDecodeError, ValueError) as e:
                print(f"Error parsing history: {e}")
                # Continue without history if parsing fails
                conversation_history = []

        # Build messages list with system prompt and history
        messages = [("system", system_prompt)]
        
        # Add conversation history
        for msg in conversation_history:
            if isinstance(msg, HumanMessage):
                messages.append(("human", msg.content))
            elif isinstance(msg, AIMessage):
                messages.append(("ai", msg.content))
        
        # Add current user message
        messages.append(("human", "{user_input}"))

        # Build prompt with history
        prompt_template = ChatPromptTemplate.from_messages(messages)

        # Gemini LLM per request
        llm = ChatGoogleGenerativeAI(
            api_key=API_KEY,
            model=MODEL,
            temperature=0.2,
        )

        chain = prompt_template | llm

        result = await run_with_timeout(
            chain.ainvoke({"user_input": q}),
            timeout_sec=25
        )

        if result == "TIMEOUT":
            return format_error("internet connection lost")

        markdown_response = result.content

        return JSONResponse(
            status_code=200,
            content=ChatResponse(
                success=True,
                error=None,
                response=markdown_response
            ).model_dump()
        )

    except Exception as e:
        print("Unexpected error:", e)
        return format_error("unexpected error occurred")


# ─────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok"}
