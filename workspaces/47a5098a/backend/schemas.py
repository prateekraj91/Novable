from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum
import uuid

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True # For compatibility with SQLAlchemy Core

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    id: Optional[uuid.UUID] = None

class TransactionType(str, Enum):
    income = "income"
    expense = "expense"

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: TransactionType

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0)
    description: Optional[str] = None
    transaction_date: date

class TransactionCreate(TransactionBase):
    category_id: uuid.UUID
    type: TransactionType # Redundant with category, but useful for validation/client hints

class TransactionUpdate(TransactionBase):
    category_id: Optional[uuid.UUID] = None
    type: Optional[TransactionType] = None

class Transaction(TransactionBase):
    id: uuid.UUID
    user_id: uuid.UUID
    category_id: uuid.UUID
    type: TransactionType
    created_at: datetime
    updated_at: datetime
    category: Optional[Category] = None # For JOINed results

    class Config:
        orm_mode = True

class DashboardSummary(BaseModel):
    total_income: float
    total_expenses: float
    current_balance: float
