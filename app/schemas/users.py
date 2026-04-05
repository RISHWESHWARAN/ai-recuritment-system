from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str,Enum):
    candidate = 'candidate'
    recruiter = 'recruiter'


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role : UserRole
    company_name : Optional[str] =None


class UserLogin(BaseModel):

    email: EmailStr
    password: str

