from fastapi import FastAPI, HTTPException, Depends, status
from dotenv import load_dotenv
import os

from .database import engine, Base
from . import models
from .routers import auth, users, projects, tasks

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable not set")

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TaskMaster SaaS API",
    description="API for managing projects and tasks.",
    version="1.0.0"
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(tasks.router, prefix="/projects", tags=["tasks"]) # Tasks router nested under projects

@app.get("/", tags=["root"])
async def read_root():
    return {"message": "Welcome to TaskMaster SaaS API"}
