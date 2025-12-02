#!/bin/bash

# TheIndiaCore Chatbot - Run Script
# This script starts the unified server using uvicorn

echo "============================================================"
echo "🚀 Starting TheIndiaCore Chatbot Server..."
echo "============================================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Please create a .env file with your GEMINI_API_KEY"
    echo ""
    echo "Example:"
    echo "GEMINI_API_KEY=your_api_key_here"
    echo ""
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ] && [ ! -d ".venv" ]; then
    echo "💡 Tip: Consider using a virtual environment"
    echo "   python -m venv venv"
    echo "   source venv/bin/activate"
    echo ""
fi

# Run the server with uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
