from fastapi import FastAPI
from .api.endpoints import auth, exams, questions, sessions
from .models import models
from .dependencies import engine
from fastapi.middleware.cors import CORSMiddleware

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Online Examination System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routers
app.include_router(auth.router, tags=["authentication"])
app.include_router(exams.router, tags=["exams"])
app.include_router(questions.router, tags=["questions"])
app.include_router(sessions.router, tags=["sessions"])