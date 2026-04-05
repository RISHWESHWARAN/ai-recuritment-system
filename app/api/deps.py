from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.data.database import get_db
from app.models.user import User
from app.core.security import decode_access_token

from sqlalchemy.future import select
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    print("TOKEN RECEIVED:", token)
    payload = decode_access_token(token)

    email = payload.get("sub")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user



def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()