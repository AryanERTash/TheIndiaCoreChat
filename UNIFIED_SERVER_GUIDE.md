# Unified Server Guide

## 🎯 Overview

The chatbot now runs on a **single unified server** that serves both:
- 🤖 **Gemini API endpoint** (`/chat`)
- 🌐 **Static files** (HTML, CSS, JS, images)

Everything runs on **port 8000** - no need for separate servers!

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install fastapi uvicorn python-dotenv slowapi langchain-google-genai pydantic
```

### 2. Set Up Environment

Create a `.env` file with your Gemini API key:

```bash
GEMINI_API_KEY=your_api_key_here
```

### 3. Run the Server

```bash
python app.py
```

**That's it!** The server will start and display:

```
============================================================
🚀 TheIndiaCore Chatbot Server Starting...
============================================================
📍 Server URL: http://localhost:8000
🌐 Chatbot UI: http://localhost:8000/
🤖 API Endpoint: http://localhost:8000/chat
💚 Health Check: http://localhost:8000/health
============================================================
Press CTRL+C to stop the server
============================================================
```

### 4. Access the Chatbot

Open your browser and go to:
```
http://localhost:8000
```

---

## 📁 Project Structure

```
project/
├── app.py                 # ✨ Unified server (API + Static files)
├── .env                   # API keys
├── index.html             # Main chatbot page
├── assets/
│   ├── css/
│   │   └── style.css      # Styles
│   ├── js/
│   │   └── chat.js        # Chatbot logic
│   └── img/
│       └── theindiacore.* # Logo files
└── requirements.txt       # Python dependencies
```

---

## 🔧 How It Works

### Single Server Architecture

```
┌─────────────────────────────────────────┐
│         FastAPI Server (Port 8000)      │
├─────────────────────────────────────────┤
│                                         │
│  📍 Routes:                             │
│  ├── GET  /           → index.html     │
│  ├── GET  /chat       → Gemini API     │
│  ├── GET  /health     → Health check   │
│  └── GET  /assets/*   → Static files   │
│                                         │
└─────────────────────────────────────────┘
```

### Request Flow

1. **User opens browser** → `http://localhost:8000`
2. **Server serves** → `index.html`
3. **Browser loads** → CSS, JS from `/assets/*`
4. **User sends message** → JavaScript calls `/chat`
5. **Server processes** → Gemini API
6. **Server responds** → JSON with bot reply
7. **Browser displays** → Bot message

---

## 🌐 API Endpoints

### 1. Root - Chatbot UI
```
GET http://localhost:8000/
```
**Returns:** `index.html` (chatbot interface)

---

### 2. Chat - Gemini API
```
GET http://localhost:8000/chat?q=Hello&sys=...&history=...
```

**Parameters:**
- `q` (required): User's message
- `sys` (optional): System prompt
- `history` (optional): URL-encoded JSON conversation history

**Response:**
```json
{
  "success": true,
  "error": null,
  "response": "Bot's reply in markdown"
}
```

---

### 3. Health Check
```
GET http://localhost:8000/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "TheIndiaCore Chatbot"
}
```

---

### 4. Static Files
```
GET http://localhost:8000/assets/css/style.css
GET http://localhost:8000/assets/js/chat.js
GET http://localhost:8000/assets/img/theindiacore.png
```

**Returns:** Static files (CSS, JS, images)

---

## ✅ Benefits of Unified Server

### 1. **Simplified Deployment**
- ✅ One server to run
- ✅ One port to manage
- ✅ One process to monitor

### 2. **No CORS Issues**
- ✅ Same origin for API and frontend
- ✅ No cross-origin requests
- ✅ Simpler security

### 3. **Easier Development**
- ✅ Single command to start
- ✅ Auto-reload on changes
- ✅ Unified logging

### 4. **Production Ready**
- ✅ Easy to containerize (Docker)
- ✅ Simple reverse proxy setup
- ✅ Single deployment unit

---

## 🔒 Security Features

### Built-in Security
- ✅ Rate limiting (50 requests/minute)
- ✅ GZIP compression
- ✅ Security headers (X-Frame-Options, etc.)
- ✅ Request timeout (25 seconds)
- ✅ Error handling

### CORS Configuration
```python
allow_origins=["*"]  # Allow all origins
allow_methods=["GET", "POST"]
allow_headers=["*"]
```

**Note:** For production, restrict `allow_origins` to your domain.

---

## 🐳 Docker Deployment (Optional)

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

### Build and Run

```bash
# Build image
docker build -t theindiacore-chatbot .

# Run container
docker run -p 8000:8000 --env-file .env theindiacore-chatbot
```

---

## 🌍 Production Deployment

### Option 1: Direct Deployment

```bash
# Install dependencies
pip install -r requirements.txt

# Run with production server
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

### Option 2: With Nginx Reverse Proxy

**Nginx config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option 3: Cloud Platforms

**Deploy to:**
- ✅ Heroku
- ✅ Railway
- ✅ Render
- ✅ Google Cloud Run
- ✅ AWS Elastic Beanstalk
- ✅ Azure App Service

---

## 🧪 Testing

### Test the Server

```bash
# Start server
python app.py

# In another terminal, test endpoints:

# 1. Test health check
curl http://localhost:8000/health

# 2. Test chat endpoint
curl "http://localhost:8000/chat?q=Hello"

# 3. Test static files
curl http://localhost:8000/
curl http://localhost:8000/assets/css/style.css
```

---

## 📊 Monitoring

### Server Logs

The server logs all requests:
```
INFO:     127.0.0.1:54321 - "GET / HTTP/1.1" 200 OK
INFO:     127.0.0.1:54321 - "GET /assets/css/style.css HTTP/1.1" 200 OK
INFO:     127.0.0.1:54321 - "GET /chat?q=Hello HTTP/1.1" 200 OK
```

### Health Monitoring

Set up a health check:
```bash
# Check every 30 seconds
watch -n 30 curl http://localhost:8000/health
```

---

## 🔧 Configuration

### Change Port

Edit `app.py`:
```python
uvicorn.run(
    "app:app",
    host="0.0.0.0",
    port=3000,  # Change to your preferred port
    reload=True
)
```

### Change Host

```python
uvicorn.run(
    "app:app",
    host="127.0.0.1",  # Localhost only
    # or
    host="0.0.0.0",    # All interfaces
    port=8000
)
```

### Disable Auto-Reload (Production)

```python
uvicorn.run(
    "app:app",
    host="0.0.0.0",
    port=8000,
    reload=False,  # Disable for production
    workers=4      # Multiple workers
)
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Error:** `Address already in use`

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use a different port
```

---

### Issue: Module Not Found

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
pip install -r requirements.txt
```

---

### Issue: API Key Missing

**Error:** `Missing GEMINI_API_KEY in .env`

**Solution:**
1. Create `.env` file
2. Add: `GEMINI_API_KEY=your_key_here`
3. Restart server

---

### Issue: Static Files Not Loading

**Error:** 404 on CSS/JS files

**Solution:**
1. Check file structure matches:
   ```
   assets/
   ├── css/style.css
   ├── js/chat.js
   └── img/...
   ```
2. Restart server
3. Clear browser cache

---

## 📝 Requirements.txt

Create `requirements.txt`:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
slowapi==0.1.9
langchain-google-genai==1.0.10
pydantic==2.5.0
```

Install:
```bash
pip install -r requirements.txt
```

---

## 🎉 Summary

### Before (Two Servers)
```bash
# Terminal 1: Backend
python gemini_endpoint.py  # Port 8000

# Terminal 2: Frontend
python -m http.server 8080  # Port 8080
```

### After (One Server)
```bash
# Single terminal
python app.py  # Port 8000 (everything)
```

### Benefits
✅ **Simpler** - One command to start  
✅ **Faster** - No CORS overhead  
✅ **Cleaner** - Single codebase  
✅ **Production-ready** - Easy to deploy  

---

## 🚀 Next Steps

1. **Start the server:**
   ```bash
   python app.py
   ```

2. **Open browser:**
   ```
   http://localhost:8000
   ```

3. **Test the chatbot:**
   - Select a language
   - Click "Say Hi"
   - Explore Indian states!

---

**Server Version:** 1.0  
**Last Updated:** November 22, 2025  
**Status:** ✅ Production Ready
