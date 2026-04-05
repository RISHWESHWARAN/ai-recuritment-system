from fastapi import FastAPI
from app.data.database import engine, Base
from app.api.chat import router as chat_router

from app.api.auth import router as auth_router
from app.api.jobs import router as jobs_router
from app.api.resume import router as resume_router
from app.api.application import router as application_router
from app.api.feedback import router as feedback_router
print("🚨🚨🚨 HELLO FROM MAIN.PY! I AM RUNNING! 🚨🚨🚨")
app = FastAPI()
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(500)
async def internal_exception_handler(request: Request, exc: Exception):
    print("🔥 CRITICAL SERVER CRASH:", repr(exc))
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 Temporarily allow ALL connections
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth_router, prefix="/auth")
app.include_router(jobs_router, prefix="/jobs")
app.include_router(resume_router, prefix="/resumes", tags=["Resumes"])
app.include_router(application_router, prefix="/applications", tags=["Applications"])
app.include_router(feedback_router, prefix="/feedback", tags=["Feedback"])

app.include_router(chat_router, prefix="/chat")
# create tables
Base.metadata.create_all(bind=engine)

