import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from schemas import Category, CategoryCreate, UserInDB
from crud import create_category, get_categories, get_category_by_id, update_category, delete_category
from auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=Category, status_code=status.HTTP_201_CREATED)
async def create_category_for_user(
    category: CategoryCreate,
    current_user: UserInDB = Depends(get_current_active_user)
):
    return await create_category(current_user.id, category)

@router.get("/", response_model=List[Category])
async def read_categories(
    current_user: UserInDB = Depends(get_current_active_user)
):
    return await get_categories(current_user.id)

@router.get("/{category_id}", response_model=Category)
async def read_category(
    category_id: uuid.UUID,
    current_user: UserInDB = Depends(get_current_active_user)
):
    category = await get_category_by_id(current_user.id, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category

@router.put("/{category_id}", response_model=Category)
async def update_category_data(
    category_id: uuid.UUID,
    category: CategoryCreate,
    current_user: UserInDB = Depends(get_current_active_user)
):
    updated_category = await update_category(current_user.id, category_id, category)
    if updated_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return updated_category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category_data(
    category_id: uuid.UUID,
    current_user: UserInDB = Depends(get_current_active_user)
):
    if not await delete_category(current_user.id, category_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return # No content on successful delete
