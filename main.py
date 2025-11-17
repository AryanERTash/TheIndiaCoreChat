import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env file
load_dotenv()

# Read API key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Configure Gemini
genai.configure(api_key=api_key)

# Use Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

def main():
    prompt = "Write a short poem about the sun."
    response = model.generate_content(prompt)
    print("Gemini response:\n")
    print(response.text)

if __name__ == "__main__":
    main()
