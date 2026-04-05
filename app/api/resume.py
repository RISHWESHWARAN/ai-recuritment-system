from fastapi import APIRouter, Depends,HTTPException,UploadFile,File
from sqlalchemy.orm import Session

from app.data.database import get_db
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate
from app.api.deps import get_current_user

router = APIRouter()


from fastapi import UploadFile, File
from PyPDF2 import PdfReader
import io

@router.post("/upload")
def upload_resume(
        file: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    print("🚦 1. Endpoint Hit! User authenticated.")
    try:
        print("🚦 2. Reading PDF bytes...")
        pdf_bytes = file.file.read()

        print("🚦 3. Parsing PDF text...")
        reader = PdfReader(io.BytesIO(pdf_bytes))

        text = "test resume "
        for page in reader.pages:
            text += page.extract_text() or ""

        if not text.strip():
            text = "empty resume"

        print("🚦 4. Saving to Database...")
        new_resume = Resume(
            user_id=current_user.id,
            content=text
        )

        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)

        print("✅ 5. Database Save Successful!")
        return {"message": "Resume uploaded successfully"}

    except Exception as e:
        print("🔥 CRITICAL CRASH:", repr(e))
        db.rollback() # Rollback in case the DB got stuck
        raise HTTPException(status_code=500, detail="Processing failed")
# Get my resume
@router.get("/me")
def get_my_resume(
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()

    return resume
from app.api.deps import get_current_user

@router.post("/test-upload")
def test_upload_route(
        file: UploadFile = File(...),
        current_user = Depends(get_current_user) # 🔥 We added Auth back!
):
    print(f"✅ SUCCESS: File {file.filename} received from {current_user.email}")
    return {"message": "Server received the file perfectly!"}