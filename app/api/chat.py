from fastapi import APIRouter
import requests

router = APIRouter()

OLLAMA_URL = "http://localhost:11434/api/generate"

@router.post("/chat")
def chat_with_ai(message: str):
    prompt = f"""
You are a career assistant AI.

User message:
{message}

Give helpful, short, actionable advice.
"""

    response = requests.post(OLLAMA_URL, json={
        "model": "llama3",
        "prompt": prompt,
        "stream": False
    })

    return {"reply": response.json()["response"]}