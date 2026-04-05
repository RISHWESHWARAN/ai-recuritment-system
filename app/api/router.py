from fastapi import APIRouter
from app.services.matcher import ResumeMatcher
# from app.services.feedback import find_missing_skills

router = APIRouter()

matcher = ResumeMatcher()


@router.get("/match")

def match(job_description: str):

    results = matcher.match(job_description)

    job_skills = job_description.lower().split()

    output = []

    for _, row in results.iterrows():

        missing = find_missing_skills(row["Resume"], job_skills)

        output.append({
            "category": row["Category"],
            "score": float(row["score"]),
            "missing_skills": missing
        })

    return {
        "job_description": job_description,
        "results": output
    }