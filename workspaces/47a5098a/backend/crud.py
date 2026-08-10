import uuid
from typing import List, Optional
from datetime import date
from sqlalchemy import text

from database import database
from schemas import UserCreate, UserInDB, CategoryCreate, Category, TransactionCreate, TransactionUpdate, Transaction, TransactionType
from auth import get_password_hash

# User CRUD
async def get_user_by_email(email: str) -> Optional[UserInDB]:
    query = "SELECT id, email, hashed_password, created_at, updated_at FROM users WHERE email = :email"
    record = await database.fetch_one(query=text(query), values={"email": email})
    if record:
        return UserInDB(**record)
    return None

async def get_user_by_id(user_id: uuid.UUID) -> Optional[UserInDB]:
    query = "SELECT id, email, hashed_password, created_at, updated_at FROM users WHERE id = :id"
    record = await database.fetch_one(query=text(query), values={"id": user_id})
    if record:
        return UserInDB(**record)
    return None

async def create_user(user: UserCreate) -> UserInDB:
    hashed_password = get_password_hash(user.password)
    query = "INSERT INTO users (email, hashed_password) VALUES (:email, :hashed_password) RETURNING id, email, created_at, updated_at"
    record = await database.fetch_one(query=text(query), values={
        "email": user.email,
        "hashed_password": hashed_password
    })
    return UserInDB(**record)

# Category CRUD
async def create_category(user_id: uuid.UUID, category: CategoryCreate) -> Category:
    query = "INSERT INTO categories (user_id, name, type) VALUES (:user_id, :name, :type) RETURNING id, user_id, name, type, created_at, updated_at"
    record = await database.fetch_one(query=text(query), values={
        "user_id": user_id,
        "name": category.name,
        "type": category.type.value # Use .value for enum
    })
    return Category(**record)

async def get_categories(user_id: uuid.UUID) -> List[Category]:
    query = "SELECT id, user_id, name, type, created_at, updated_at FROM categories WHERE user_id = :user_id ORDER BY name"
    records = await database.fetch_all(query=text(query), values={"user_id": user_id})
    return [Category(**record) for record in records]

async def get_category_by_id(user_id: uuid.UUID, category_id: uuid.UUID) -> Optional[Category]:
    query = "SELECT id, user_id, name, type, created_at, updated_at FROM categories WHERE id = :id AND user_id = :user_id"
    record = await database.fetch_one(query=text(query), values={"id": category_id, "user_id": user_id})
    if record:
        return Category(**record)
    return None

async def update_category(user_id: uuid.UUID, category_id: uuid.UUID, category: CategoryCreate) -> Optional[Category]:
    query = "UPDATE categories SET name = :name, type = :type, updated_at = NOW() WHERE id = :id AND user_id = :user_id RETURNING id, user_id, name, type, created_at, updated_at"
    record = await database.fetch_one(query=text(query), values={
        "id": category_id,
        "user_id": user_id,
        "name": category.name,
        "type": category.type.value
    })
    if record:
        return Category(**record)
    return None

async def delete_category(user_id: uuid.UUID, category_id: uuid.UUID) -> bool:
    query = "DELETE FROM categories WHERE id = :id AND user_id = :user_id"
    result = await database.execute(query=text(query), values={"id": category_id, "user_id": user_id})
    return result > 0

# Transaction CRUD
async def create_transaction(user_id: uuid.UUID, transaction: TransactionCreate) -> Transaction:
    query = "INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date) VALUES (:user_id, :category_id, :type, :amount, :description, :transaction_date) RETURNING id, user_id, category_id, type, amount, description, transaction_date, created_at, updated_at"
    record = await database.fetch_one(query=text(query), values={
        "user_id": user_id,
        "category_id": transaction.category_id,
        "type": transaction.type.value,
        "amount": transaction.amount,
        "description": transaction.description,
        "transaction_date": transaction.transaction_date
    })
    return Transaction(**record)

async def get_transactions(user_id: uuid.UUID, start_date: Optional[date] = None, end_date: Optional[date] = None, category_id: Optional[uuid.UUID] = None, transaction_type: Optional[TransactionType] = None) -> List[Transaction]:
    base_query = "SELECT t.id, t.user_id, t.category_id, t.type, t.amount, t.description, t.transaction_date, t.created_at, t.updated_at, c.id AS category_id_alias, c.user_id AS category_user_id, c.name AS category_name, c.type AS category_type, c.created_at AS category_created_at, c.updated_at AS category_updated_at FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id = :user_id"
    values = {"user_id": user_id}

    if start_date:
        base_query += " AND t.transaction_date >= :start_date"
        values["start_date"] = start_date
    if end_date:
        base_query += " AND t.transaction_date <= :end_date"
        values["end_date"] = end_date
    if category_id:
        base_query += " AND t.category_id = :category_id"
        values["category_id"] = category_id
    if transaction_type:
        base_query += " AND t.type = :type"
        values["type"] = transaction_type.value

    base_query += " ORDER BY t.transaction_date DESC, t.created_at DESC"

    records = await database.fetch_all(query=text(base_query), values=values)

    transactions_with_categories = []
    for record in records:
        category_data = {
            "id": record["category_id_alias"],
            "user_id": record["category_user_id"],
            "name": record["category_name"],
            "type": record["category_type"],
            "created_at": record["category_created_at"],
            "updated_at": record["category_updated_at"]
        }
        category_obj = Category(**category_data)

        transaction_data = dict(record)
        # Remove category-prefixed keys to avoid conflict
        for k in list(transaction_data.keys()):
            if k.startswith("category_"):
                del transaction_data[k]

        transaction_obj = Transaction(**transaction_data)
        transaction_obj.category = category_obj
        transactions_with_categories.append(transaction_obj)

    return transactions_with_categories

async def get_transaction_by_id(user_id: uuid.UUID, transaction_id: uuid.UUID) -> Optional[Transaction]:
    query = "SELECT t.id, t.user_id, t.category_id, t.type, t.amount, t.description, t.transaction_date, t.created_at, t.updated_at, c.id AS category_id_alias, c.user_id AS category_user_id, c.name AS category_name, c.type AS category_type, c.created_at AS category_created_at, c.updated_at AS category_updated_at FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.id = :id AND t.user_id = :user_id"
    record = await database.fetch_one(query=text(query), values={"id": transaction_id, "user_id": user_id})
    if record:
        category_data = {
            "id": record["category_id_alias"],
            "user_id": record["category_user_id"],
            "name": record["category_name"],
            "type": record["category_type"],
            "created_at": record["category_created_at"],
            "updated_at": record["category_updated_at"]
        }
        category_obj = Category(**category_data)

        transaction_data = dict(record)
        for k in list(transaction_data.keys()):
            if k.startswith("category_"):
                del transaction_data[k]

        transaction_obj = Transaction(**transaction_data)
        transaction_obj.category = category_obj
        return transaction_obj
    return None

async def update_transaction(user_id: uuid.UUID, transaction_id: uuid.UUID, transaction: TransactionUpdate) -> Optional[Transaction]:
    updates = {k: v for k, v in transaction.dict(exclude_unset=True).items() if v is not None}
    if not updates:
        return await get_transaction_by_id(user_id, transaction_id)

    update_parts = []
    values = {"id": transaction_id, "user_id": user_id}
    for k, v in updates.items():
        if k == "type": # Handle Enum for type
            update_parts.append(f"{k} = :{k}")
            values[k] = v.value
        else:
            update_parts.append(f"{k} = :{k}")
            values[k] = v

    update_query = ", ".join(update_parts)
    query = f"UPDATE transactions SET {update_query}, updated_at = NOW() WHERE id = :id AND user_id = :user_id RETURNING id, user_id, category_id, type, amount, description, transaction_date, created_at, updated_at"
    record = await database.fetch_one(query=text(query), values=values)
    if record:
        # Fetch the category separately or join again if necessary for full Transaction model
        category = await get_category_by_id(user_id, record["category_id"])
        transaction_obj = Transaction(**record)
        transaction_obj.category = category
        return transaction_obj
    return None

async def delete_transaction(user_id: uuid.UUID, transaction_id: uuid.UUID) -> bool:
    query = "DELETE FROM transactions WHERE id = :id AND user_id = :user_id"
    result = await database.execute(query=text(query), values={"id": transaction_id, "user_id": user_id})
    return result > 0
