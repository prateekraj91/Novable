from fastapi import APIRouter, Depends, HTTPException, status, Query
from datetime import date
from typing import Optional
from sqlalchemy import text

from schemas import DashboardSummary, UserInDB, TransactionType
from auth import get_current_active_user
from database import database

router = APIRouter()

@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    current_user: UserInDB = Depends(get_current_active_user),
    start_date: Optional[date] = Query(None, description="Filter summary from this date (inclusive)"),
    end_date: Optional[date] = Query(None, description="Filter summary up to this date (inclusive)")
):
    user_id = current_user.id

    base_query = "SELECT type, SUM(amount) AS total_amount FROM transactions WHERE user_id = :user_id"
    values = {"user_id": user_id}

    if start_date:
        base_query += " AND transaction_date >= :start_date"
        values["start_date"] = start_date
    if end_date:
        base_query += " AND transaction_date <= :end_date"
        values["end_date"] = end_date

    base_query += " GROUP BY type"

    records = await database.fetch_all(query=text(base_query), values=values)

    total_income = 0.0
    total_expenses = 0.0

    for record in records:
        if record["type"] == TransactionType.income:
            total_income = float(record["total_amount"])
        elif record["type"] == TransactionType.expense:
            total_expenses = float(record["total_amount"])

    current_balance = total_income - total_expenses

    return DashboardSummary(
        total_income=total_income,
        total_expenses=total_expenses,
        current_balance=current_balance
    )
