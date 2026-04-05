from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime,Float
from datetime import datetime
from app.data.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    cutoff_score = Column(Float, default=0.0)