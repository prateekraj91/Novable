from sqlalchemy.orm import Session
from . import models, schemas
from .auth_utils import get_password_hash # get_password_hash for creating user
from uuid import UUID
from typing import List, Optional
from datetime import date # for TaskUpdate/Create

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: UUID):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_projects(db: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> List[models.Project]:
    return db.query(models.Project).filter(models.Project.user_id == user_id).offset(skip).limit(limit).all()

def get_project(db: Session, project_id: UUID, user_id: UUID) -> Optional[models.Project]:
    return db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == user_id).first()

def create_project(db: Session, project: schemas.ProjectCreate, user_id: UUID) -> models.Project:
    db_project = models.Project(**project.dict(), user_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: UUID, user_id: UUID, project_update: schemas.ProjectUpdate) -> Optional[models.Project]:
    db_project = get_project(db, project_id, user_id)
    if db_project:
        update_data = project_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_project, key, value)
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: UUID, user_id: UUID) -> Optional[models.Project]:
    db_project = get_project(db, project_id, user_id)
    if db_project:
        db.delete(db_project)
        db.commit()
    return db_project

def get_tasks(db: Session, project_id: UUID, skip: int = 0, limit: int = 100) -> List[models.Task]:
    return db.query(models.Task).filter(models.Task.project_id == project_id).offset(skip).limit(limit).all()

def get_task(db: Session, task_id: UUID, project_id: UUID) -> Optional[models.Task]:
    return db.query(models.Task).filter(models.Task.id == task_id, models.Task.project_id == project_id).first()

def create_task(db: Session, task: schemas.TaskCreate, project_id: UUID) -> models.Task:
    db_task = models.Task(**task.dict(exclude_unset=True), project_id=project_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: UUID, project_id: UUID, task_update: schemas.TaskUpdate) -> Optional[models.Task]:
    db_task = get_task(db, task_id, project_id)
    if db_task:
        update_data = task_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: UUID, project_id: UUID) -> Optional[models.Task]:
    db_task = get_task(db, task_id, project_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task
