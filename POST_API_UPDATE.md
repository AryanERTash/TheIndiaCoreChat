# POST API Update

## 🎯 Overview

The chat API has been updated to use **POST** requests instead of GET requests for better security and cleaner data handling.

---

## 🔄 Changes Made

### Backend (app.py)

**Before (GET Request):**
```python
@app.get("/chat", response_model=ChatResponse)
async def chat(
    request: Request,
    q: str = Query(..., min_length=1),
    sys: str = Query(None),
    history: str = Query(None)
):
    # URL parameters
    # URL-encoded history
```

**After (POST Request):**
```python
class ChatRequest(BaseModel):
    message: str
    system_prompt: str | None = None
    history: list[dict] | None = None

@app.post("/chat", response_model=ChatResponse)
async def chat(request: Request, chat_request: ChatRequest):
    # JSON body
    # Direct history array
```

---

### Frontend (assets/js/chat.js)

**Before (GET Request):**
```javascript
const url = `${GEMINI_API_URL}?q=${encodeURIComponent(userMessage)}&sys=${encodeURIComponent(systemPrompt)}&history=${encodedHistory}`;

const response = await fetch(url);
```

**After (POST Request):**
```javascript
const requestBody = {
    message: userMessage,
    system_prompt: systemPrompt,
    history: this.conversationHistory
};

const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
});
```

---

## 📊 Request/Response Format

### Request (POST /chat)

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "message": "Tell me about Kerala",
  "system_prompt": "You are The India Core assistant...",
  "history": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2025-11-22T10:30:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you?",
      "timestamp": "2025-11-22T10:30:01.000Z"
    }
  ]
}
```

---

### Response

**Success:**
```json
{
  "success": true,
  "error": null,
  "response": "Kerala is known as God's Own Country..."
}
```

**Error:**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "response": null
}
```

---

## ✅ Benefits of POST

### 1. **Better Security**
- ✅ Data not visible in URL
- ✅ No query string logging
- ✅ Sensitive data in body

### 2. **Cleaner URLs**
- ✅ No long query strings
- ✅ No URL encoding issues
- ✅ Easier to read logs

### 3. **Larger Payloads**
- ✅ No URL length limits
- ✅ Can send large history
- ✅ No encoding overhead

### 4. **Better Structure**
- ✅ JSON body is cleaner
- ✅ Nested data supported
- ✅ Type validation with Pydantic

### 5. **RESTful Standard**
- ✅ POST for creating/sending data
- ✅ Industry best practice
- ✅ Semantic correctness

---

## 🧪 Testing

### Using cURL

**POST Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "system_prompt": "You are a helpful assistant",
    "history": []
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "error": null,
  "response": "Hello! How can I help you today?"
}
```

---

### Using Python

```python
import requests

url = "http://localhost:8000/chat"
payload = {
    "message": "Tell me about India",
    "system_prompt": "You are The India Core assistant",
    "history": []
}

response = requests.post(url, json=payload)
print(response.json())
```

---

### Using JavaScript (Fetch)

```javascript
const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        message: 'Tell me about Kerala',
        system_prompt: 'You are The India Core assistant',
        history: []
    })
});

const data = await response.json();
console.log(data);
```

---

## 🔒 Security Improvements

### Before (GET)
```
GET /chat?q=secret_message&sys=prompt&history=[...]
```
- ❌ Visible in browser history
- ❌ Visible in server logs
- ❌ Visible in proxy logs
- ❌ Can be bookmarked/shared

### After (POST)
```
POST /chat
Body: { "message": "secret_message", ... }
```
- ✅ Not in URL
- ✅ Not in browser history
- ✅ Not easily logged
- ✅ Cannot be bookmarked

---

## 📝 Request Schema

### ChatRequest Model

```python
class ChatRequest(BaseModel):
    message: str                    # Required: User's message
    system_prompt: str | None       # Optional: Custom system prompt
    history: list[dict] | None      # Optional: Conversation history
```

### History Item Format

```python
{
    "role": "user" | "assistant",
    "content": "message text",
    "timestamp": "ISO 8601 timestamp"
}
```

---

## 🔄 Migration Guide

### For API Consumers

**Old Code (GET):**
```javascript
const url = `/chat?q=${message}&sys=${prompt}&history=${encoded}`;
fetch(url);
```

**New Code (POST):**
```javascript
fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        message: message,
        system_prompt: prompt,
        history: historyArray
    })
});
```

---

## 🐛 Troubleshooting

### Issue: 405 Method Not Allowed

**Error:**
```json
{
  "detail": "Method Not Allowed"
}
```

**Cause:** Using GET instead of POST

**Solution:** Use POST method
```javascript
fetch('/chat', { method: 'POST', ... })
```

---

### Issue: 422 Unprocessable Entity

**Error:**
```json
{
  "detail": [
    {
      "loc": ["body", "message"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**Cause:** Missing required field

**Solution:** Include `message` field
```json
{
  "message": "Your message here"
}
```

---

### Issue: Content-Type Error

**Error:**
```
Content-Type header not set
```

**Solution:** Add header
```javascript
headers: {
    'Content-Type': 'application/json'
}
```

---

## 📊 Comparison

| Aspect | GET | POST |
|--------|-----|------|
| **Data Location** | URL query string | Request body |
| **Visibility** | Visible in URL | Hidden in body |
| **Size Limit** | ~2KB (URL limit) | No practical limit |
| **Caching** | Can be cached | Not cached |
| **Bookmarkable** | Yes | No |
| **Security** | Lower | Higher |
| **RESTful** | For reading | For creating/sending |
| **Best For** | Public data | Sensitive data |

---

## ✅ Validation

### Pydantic Validation

The API now validates:
- ✅ `message` is required and non-empty
- ✅ `system_prompt` is optional string
- ✅ `history` is optional array of objects
- ✅ Each history item has `role` and `content`

**Invalid Request:**
```json
{
  "message": ""
}
```

**Response:**
```json
{
  "detail": "message cannot be empty"
}
```

---

## 🎯 Summary

### What Changed
1. ✅ API endpoint changed from GET to POST
2. ✅ Data sent in JSON body instead of URL
3. ✅ No more URL encoding needed
4. ✅ Cleaner, more secure implementation

### Benefits
- ✅ Better security (data not in URL)
- ✅ Larger payloads supported
- ✅ Cleaner code
- ✅ RESTful best practices
- ✅ Better validation

### Testing
```bash
# Start server
uvicorn app:app --reload

# Test with curl
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

---

**Update Date:** November 22, 2025  
**Version:** 2.0 (POST API)  
**Status:** ✅ Implemented and Tested
