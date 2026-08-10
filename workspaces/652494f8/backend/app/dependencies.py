import os
import uuid

from fastapi import Header, HTTPException, status, Depends
from supabase import create_client, Client

from .config import settings

SUPABASE_URL = settings.SUPABASE_URL
SUPABASE_KEY = settings.SUPABASE_KEY

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_current_user_id(authorization: str = Header(...)) -> uuid.UUID:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header is missing")

    try:
        scheme, token = authorization.split()
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header format")

    if scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Bearer token is supported")

    try:
        user_response = await supabase.auth.get_user(token)
        if user_response.data.user:
            user_id = user_response.data.user.id
            return uuid.UUID(user_id)
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or invalid token")
    except Exception as e:
        print(f"Supabase authentication error: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")