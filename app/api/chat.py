from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import requests

from app.data.database import get_db
from app.models.resume import Resume
from app.api.deps import get_current_user
from app.services.matcher import calculate_similarity

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    description: str

@router.post("/chat")
def chat_with_ai(
        data: ChatRequest,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()

    if not resume:
        return {"reply": "Upload resume first"}

    # Calculate score again (lightweight)
    score = calculate_similarity(resume.content, data.description)

    prompt = f"""
You are an AI recruiter.

Candidate Match Score: {score} (0 to 1 scale)

Interpretation:
- Below 0.5 → weak match
- 0.5 to 0.7 → moderate match
- Above 0.7 → strong match

JOB DESCRIPTION:
{data.description}

RESUME:
{resume.content}

User Question:
{data.message}

Instructions:
- Explain clearly why this score was given
- Identify missing skills
- Suggest concrete improvements
- Keep response structured and actionable
"""

    try:
        print("🤖 Sending prompt to local Ollama...")
        # Increased timeout to 60 seconds to prevent silent crashes
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "phi",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        response.raise_for_status()
        ai_text = response.json()["response"]

    except requests.exceptions.ConnectionError:
        print("🔥 OLLAMA ERROR: Is it running?")
        ai_text = "System Error: Cannot connect to AI. Please ensure Ollama is running (run 'ollama serve' in terminal)."
    except Exception as e:
        print("🔥 AI PROCESSING ERROR:", repr(e))
        ai_text = "System Error: The AI took too long to respond or crashed."

    return {"reply": ai_text}