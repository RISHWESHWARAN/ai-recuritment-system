from pydantic import BaseModel
from typing import Optional


class JobCreate(BaseModel):
    title: str
    description: str
    cutoff_score: Optional[float] = 0.0