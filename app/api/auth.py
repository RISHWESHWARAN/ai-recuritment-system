from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import get_user_by_email
from app.data.database import get_db
from app.models.user import User
from app.schemas.users import UserCreate, UserLogin
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.users import UserRole
router = APIRouter()


# SIGNUP

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    try:
        existing_user = db.query(User).filter(User.email == user.email).first()

        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        if user.role == UserRole.recruiter and not user.company_name:
            raise HTTPException(status_code=400, detail="company_name is required")

        new_user = User(
            email=user.email,
            password_hash=hash_password(user.password),
            role=user.role.value,
            company_name=user.company_name
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message": "User created successfully"}

    except Exception as e:
        print("REAL ERROR:", e)   # 🔥 THIS
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = get_user_by_email(db, form_data.username)

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }