from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from database import database
from routers import auth_router, users_router, categories_router, transactions_router, dashboard_router

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manages the startup and shutdown of the database connection."""
    print("Connecting to the database...")
    await database.connect()
    print("Database connected.")
    yield
    print("Disconnecting from the database...")
    await database.disconnect()
    print("Database disconnected.")

app = FastAPI(
    title="ExpensePulse SaaS API",
    description="API for managing personal income and expenses.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Allow your Next.js frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include routers
app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
app.include_router(users_router.router, prefix="/users", tags=["Users"])
app.include_router(categories_router.router, prefix="/categories", tags=["Categories"])
app.include_router(transactions_router.router, prefix="/transactions", tags=["Transactions"])
app.include_router(dashboard_router.router, prefix="/dashboard", tags=["Dashboard"])

@app.get("/", tags=["Health Check"])
async def root():
    return {"message": "Welcome to ExpensePulse SaaS API!"}
