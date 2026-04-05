from sqlalchemy import Column, Integer, ForeignKey, Float, String, DateTime
from datetime import datetime
from app.data.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Float)
    status = Column(String, default="applied")
    created_at = Column(DateTime, default=datetime.utcnow)