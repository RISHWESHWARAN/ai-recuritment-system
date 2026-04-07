import requests
from app.services.matcher import calculate_similarity
OLLAMA_URL = "http://localhost:11434/api/generate"

def generate_feedback(resume_text: str, job_description: str, score: float):

    prompt = f"""
You are an AI recruiter.

Candidate Score: {score}

JOB DESCRIPTION:
{job_description}

RESUME:
{resume_text}

Give output STRICTLY in this format:

Reason for Rejection:
- ...

Skill Gaps:
- ...

Improvements:
- ...
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
    )

    return response.json()["response"]