from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.data.database import get_db
from app.models.job import Job
from app.schemas.job import JobCreate
from app.api.deps import get_current_user
from app.models.user import User
router = APIRouter()


# Create job (ONLY recruiter)
@router.post("/create")
def create_job(
        data: JobCreate,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    if current_user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can post jobs")

    job = Job(
        recruiter_id=current_user.id,
        title=data.title,
        description=data.description,
        cutoff_score=data.cutoff_score
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return {"message": "Job created successfully"}




@router.get("/")
def get_jobs(db: Session = Depends(get_db)):
    jobs = (
        db.query(Job, User.company_name)
        .join(User, Job.recruiter_id == User.id)
        .all()
    )

    return [
        {
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "company": company
        }
        for job, company in jobs
    ]


@router.put("/update/{job_id}")
def update_job(
        job_id: int,
        data: JobCreate,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    job.title = data.title
    job.description = data.description
    job.cutoff_score = data.cutoff_score

    db.commit()
    db.refresh(job)

    return {"message": "Job updated successfully"}

@router.delete("/delete/{job_id}")
def delete_job(
        job_id: int,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(job)
    db.commit()

    return {"message": "Job deleted successfully"}