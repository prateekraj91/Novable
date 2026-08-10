import uuid
from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query

from schemas import Transaction, TransactionCreate, TransactionUpdate, UserInDB, TransactionType
from crud import create_transaction, get_transactions, get_transaction_by_id, update_transaction, delete_transaction, get_category_by_id
from auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=Transaction, status_code=status.HTTP_201_CREATED)
async def create_transaction_for_user(
    transaction_in: TransactionCreate,
    current_user: UserInDB = Depends(get_current_active_user)
):
    # Verify category belongs to the user and matches type
    category = await get_category_by_id(current_user.id, transaction_in.category_id)
    if not category or category.type != transaction_in.type:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category or category type mismatch")

    new_transaction = await create_transaction(current_user.id, transaction_in)
    # Attach category object for response model
    new_transaction.category = category
    return new_transaction

@router.get("/", response_model=List[Transaction])
async def read_transactions(
    current_user: UserInDB = Depends(get_current_active_user),
    start_date: Optional[date] = Query(None, description="Filter transactions from this date (inclusive)"),
    end_date: Optional[date] = Query(None, description="Filter transactions up to this date (inclusive)"),
    category_id: Optional[uuid.UUID] = Query(None, description="Filter transactions by category ID"),
    transaction_type: Optional[TransactionType] = Query(None, description="Filter transactions by type (income/expense)")
):
    # Optional: Verify category_id if provided, that it belongs to the user
    if category_id:
        category = await get_category_by_id(current_user.id, category_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found for this user")

    return await get_transactions(current_user.id, start_date, end_date, category_id, transaction_type)

@router.get("/{transaction_id}", response_model=Transaction)
async def read_transaction(
    transaction_id: uuid.UUID,
    current_user: UserInDB = Depends(get_current_active_user)
):
    transaction = await get_transaction_by_id(current_user.id, transaction_id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transaction

@router.put("/{transaction_id}", response_model=Transaction)
async def update_transaction_data(
    transaction_id: uuid.UUID,
    transaction_in: TransactionUpdate,
    current_user: UserInDB = Depends(get_current_active_user)
):
    if transaction_in.category_id:
        category = await get_category_by_id(current_user.id, transaction_in.category_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category")
        if transaction_in.type and category.type != transaction_in.type:
             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category type mismatch with transaction type")

    updated_transaction = await update_transaction(current_user.id, transaction_id, transaction_in)
    if updated_transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return updated_transaction

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction_data(
    transaction_id: uuid.UUID,
    current_user: UserInDB = Depends(get_current_active_user)
):
    if not await delete_transaction(current_user.id, transaction_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return # No content on successful delete
