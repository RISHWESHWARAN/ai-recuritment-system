from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.application import Application
from app.data.database import get_db
from app.api.deps import get_current_user
from app.models.job import Job
from app.models.resume import Resume
from app.services.matcher import calculate_similarity
from app.services.feedback import generate_feedback

router = APIRouter()


@router.get("/{job_id}")
def get_feedback(
        job_id: int,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates allowed")

    job = db.query(Job).filter(Job.id == job_id).first()
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()

    if not job or not resume:
        raise HTTPException(status_code=404, detail="Missing job or resume")

    # SBERT score
    score = calculate_similarity(resume.content, job.description)

    # 🔥 LLM feedback
    feedback = generate_feedback(resume.content, job.description, score)

    return {
        "similarity_score": score,
        "feedback": feedback
    }
from pydantic import BaseModel

class TempEval(BaseModel):
    description: str
@router.post("/evaluate")
def evaluate_resume_temp(
        data: TempEval,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    score = calculate_similarity(resume.content, data.description)



    return {
        "similarity_score": score

    }

@router.get("/rejection/{application_id}")
def rejection_feedback(application_id: int, db: Session = Depends(get_db)):

    application = db.query(Application).get(application_id)
    job = db.query(Job).get(application.job_id)
    resume = db.query(Resume).get(application.resume_id)

    if application.status != "rejected":
        return {"message": "Not rejected"}

    feedback = generate_feedback(
        resume.content,
        job.description
    )

    return {
        "feedback": feedback
    }