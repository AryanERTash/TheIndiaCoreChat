import os
import asyncio
from fastapi import FastAPI, Query, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from pydantic import BaseModel
from dotenv import load_dotenv
from slowapi import Limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# LangChain Gemini
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

# Load API key
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in .env")

MODEL = "gemini-2.5-flash-lite"

# ─────────────────────────────────────────────
# ASYNC LLM SETUP (THREAD-SAFE)
# ─────────────────────────────────────────────
llm = ChatGoogleGenerativeAI(
    api_key=API_KEY,
    model=MODEL,
    temperature=0.7,
)

SYSTEM_PROMPT = "You are a helpful assistant. Reply in Markdown format."

prompt_template = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", "{user_input}")
])

# ─────────────────────────────────────────────
# FastAPI app config
# ─────────────────────────────────────────────
app = FastAPI(title="Gemini Chat API", version="1.1")

# Rate limiting
limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.add_exception_handler(RateLimitExceeded,
    lambda r, e: format_error("rate limit exceeded")
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
# Security middleware
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
# Response schema
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
# Timeout wrapper (non blocking)
# ─────────────────────────────────────────────
async def run_with_timeout(awaitable, timeout_sec=30):
    try:
        return await asyncio.wait_for(awaitable, timeout=timeout_sec)
    except asyncio.TimeoutError:
        return "TIMEOUT"
    except Exception:
        raise

# ─────────────────────────────────────────────
# Chat Endpoint (ASYNC & NON-BLOCKING)
# ─────────────────────────────────────────────
@app.get("/chat", response_model=ChatResponse)
@limiter.limit("5/minute")
async def chat(request: Request, q: str = Query(..., min_length=1)):

    try:
        chain = prompt_template | llm

        # ASYNC — does NOT use worker threads, so fully non-blocking
        result = await run_with_timeout(
            chain.ainvoke({"user_input": q}),
            timeout_sec=25
        )

        if result == "TIMEOUT":
            return format_error("Internet connection lost")

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
        return format_error("Unexpected error occurred")


# ─────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok"}
