import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

def generate_feedback(resume_text: str, job_description: str):
    prompt = f"""
You are an AI recruiter.

Analyze the candidate based on:

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

Tone: Clear, professional, helpful.
"""

    response = requests.post(OLLAMA_URL, json={
        "model": "llama3",
        "prompt": prompt,
        "stream": False
    })

    return response.json()["response"]