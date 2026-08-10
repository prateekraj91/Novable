from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import Annotated
import os

from .database import engine, Base
from .routers import projects, tasks
from .dependencies import get_current_user_id

async def create_db_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Not creating tables automatically in production, will use migrations
    # For local development, uncomment create_db_tables()
    # await create_db_tables()
    print("Application startup")
    yield
    print("Application shutdown")

app = FastAPI(
    title="TaskMaster SaaS API",
    version="1.0.0",
    description="API for managing projects and tasks.",
    lifespan=lifespan
)

origins = [os.getenv("FRONTEND_URL", "http://localhost:3000")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/projects", tags=["projects"], dependencies=[Depends(get_current_user_id)])
app.include_router(tasks.router, prefix="/projects/{project_id}/tasks", tags=["tasks"], dependencies=[Depends(get_current_user_id)])

@app.get("/")
async def root():
    return {"message": "Welcome to TaskMaster SaaS API"}