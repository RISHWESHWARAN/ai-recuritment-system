from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.data.database import get_db
from app.api.deps import get_current_user
from app.models.job import Job
from app.models.resume import Resume
from app.models.application import Application
from app.services.matcher import calculate_similarity

router = APIRouter()


@router.post("/apply/{job_id}")
def apply_job(
        job_id: int,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    # only candidate can apply
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can apply")

    # get job
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # get resume
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=400, detail="Upload resume first")

    # SBERT similarity
    score = calculate_similarity(resume.content, job.description)

    # apply cutoff logic
    status = "accepted" if score >= job.cutoff_score else "rejected"

    # store application
    application = Application(
        job_id=job.id,
        candidate_id=current_user.id,
        score=score,
        status=status
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    # debug (optional)
    print("SCORE:", score)
    print("CUTOFF:", job.cutoff_score)
    print("STATUS:", status)

    return {
        "message": "Applied successfully",
        "similarity_score": score,
        "status": status
    }