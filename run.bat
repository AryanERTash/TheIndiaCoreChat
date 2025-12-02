@echo off
REM TheIndiaCore Chatbot - Run Script (Windows)
REM This script starts the unified server using uvicorn

echo ============================================================
echo 🚀 Starting TheIndiaCore Chatbot Server...
echo ============================================================
echo.

REM Check if .env file exists
if not exist .env (
    echo ⚠️  Warning: .env file not found!
    echo Please create a .env file with your GEMINI_API_KEY
    echo.
    echo Example:
    echo GEMINI_API_KEY=your_api_key_here
    echo.
    pause
    exit /b 1
)

REM Run the server with uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
