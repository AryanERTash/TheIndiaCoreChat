# TheIndiaCore Chatbot - Server Setup

## 🚀 Quick Start

### Option 1: Using Run Script (Recommended)

**Linux/Mac:**
```bash
./run.sh
```

**Windows:**
```bash
run.bat
```

### Option 2: Using Uvicorn Directly

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Option 3: Using Python

```bash
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📋 Prerequisites

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Create `.env` File

Create a file named `.env` in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🎯 Server Commands

### Development Mode (Auto-reload)

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**Features:**
- ✅ Auto-reloads on code changes
- ✅ Detailed logging
- ✅ Good for development

---

### Production Mode

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

**Features:**
- ✅ Multiple workers (4)
- ✅ Better performance
- ✅ No auto-reload
- ✅ Production-ready

---

### Custom Port

```bash
uvicorn app:app --host 0.0.0.0 --port 3000 --reload
```

---

### Localhost Only

```bash
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

---

## 🌐 Access the Application

Once the server is running, open your browser:

```
http://localhost:8000
```

### Available Endpoints

| Endpoint | Description |
|----------|-------------|
| `http://localhost:8000/` | Chatbot UI (main page) |
| `http://localhost:8000/chat` | Gemini API endpoint |
| `http://localhost:8000/health` | Health check |
| `http://localhost:8000/assets/*` | Static files (CSS, JS, images) |

---

## 🔧 Uvicorn Options

### Common Options

```bash
uvicorn app:app [OPTIONS]
```

| Option | Description | Example |
|--------|-------------|---------|
| `--host` | Bind to host | `--host 0.0.0.0` |
| `--port` | Bind to port | `--port 8000` |
| `--reload` | Auto-reload on changes | `--reload` |
| `--workers` | Number of workers | `--workers 4` |
| `--log-level` | Logging level | `--log-level info` |
| `--access-log` | Enable access log | `--access-log` |
| `--no-access-log` | Disable access log | `--no-access-log` |

### Examples

**Development with debug logging:**
```bash
uvicorn app:app --reload --log-level debug
```

**Production with 4 workers:**
```bash
uvicorn app:app --workers 4 --no-access-log
```

**Custom host and port:**
```bash
uvicorn app:app --host 192.168.1.100 --port 3000
```

---

## 📊 Server Output

When you start the server, you'll see:

```
============================================================
🚀 TheIndiaCore Chatbot Server Started!
============================================================
📍 Server URL: http://localhost:8000
🌐 Chatbot UI: http://localhost:8000/
🤖 API Endpoint: http://localhost:8000/chat
💚 Health Check: http://localhost:8000/health
============================================================
Press CTRL+C to stop the server
============================================================

INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

---

## 🧪 Testing the Server

### 1. Test Health Check

```bash
curl http://localhost:8000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "service": "TheIndiaCore Chatbot"
}
```

---

### 2. Test Chat Endpoint

```bash
curl "http://localhost:8000/chat?q=Hello"
```

**Expected response:**
```json
{
  "success": true,
  "error": null,
  "response": "Hello! How can I help you today?"
}
```

---

### 3. Test Static Files

```bash
# Test main page
curl http://localhost:8000/

# Test CSS
curl http://localhost:8000/assets/css/style.css

# Test JavaScript
curl http://localhost:8000/assets/js/chat.js
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Error:**
```
ERROR:    [Errno 48] Address already in use
```

**Solution 1: Kill the process**
```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>
```

**Solution 2: Use different port**
```bash
uvicorn app:app --port 8001 --reload
```

---

### Issue: Module Not Found

**Error:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```bash
pip install -r requirements.txt
```

---

### Issue: API Key Missing

**Error:**
```
RuntimeError: Missing GEMINI_API_KEY in .env
```

**Solution:**
1. Create `.env` file in project root
2. Add: `GEMINI_API_KEY=your_key_here`
3. Restart server

---

### Issue: Permission Denied (run.sh)

**Error:**
```
bash: ./run.sh: Permission denied
```

**Solution:**
```bash
chmod +x run.sh
./run.sh
```

---

## 🔒 Security Notes

### Development vs Production

**Development (--reload):**
- ✅ Auto-reload on changes
- ⚠️ Single worker
- ⚠️ Not for production

**Production (--workers):**
- ✅ Multiple workers
- ✅ Better performance
- ✅ No auto-reload
- ✅ Production-ready

### Environment Variables

**Never commit `.env` file to git!**

Add to `.gitignore`:
```
.env
*.env
```

---

## 📦 Virtual Environment (Recommended)

### Create Virtual Environment

```bash
# Create
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Deactivate

```bash
deactivate
```

---

## 🐳 Docker (Optional)

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build and Run

```bash
# Build
docker build -t theindiacore-chatbot .

# Run
docker run -p 8000:8000 --env-file .env theindiacore-chatbot
```

---

## 🌍 Deployment

### Deploy to Cloud

**Heroku:**
```bash
# Create Procfile
echo "web: uvicorn app:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git push heroku main
```

**Railway:**
```bash
# Railway will auto-detect FastAPI
railway up
```

**Render:**
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

---

## 📝 Requirements

### Python Version
- Python 3.9 or higher

### Dependencies
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
slowapi==0.1.9
langchain-google-genai==1.0.10
pydantic==2.5.0
```

---

## 🎉 Summary

### Start Server (Choose One)

```bash
# Option 1: Run script
./run.sh

# Option 2: Uvicorn directly
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Option 3: Python module
python -m uvicorn app:app --reload
```

### Access Application

```
http://localhost:8000
```

### Stop Server

Press `CTRL+C` in the terminal

---

**Server Version:** 1.0  
**Last Updated:** November 22, 2025  
**Status:** ✅ Production Ready
