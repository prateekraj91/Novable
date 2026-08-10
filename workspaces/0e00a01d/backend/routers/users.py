from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session # Keep in case future user endpoints need DB session
from .. import schemas, models
from ..database import get_db # Keep in case future user endpoints need DB session
from ..auth_utils import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user
