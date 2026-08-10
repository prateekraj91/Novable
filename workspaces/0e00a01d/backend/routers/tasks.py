from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from .. import schemas, crud, models
from ..database import get_db
from ..auth_utils import get_current_active_user

router = APIRouter()

@router.post("/{project_id}/tasks", response_model=schemas.Task, status_code=status.HTTP_201_CREATED)
def create_task_for_project(
    project_id: UUID,
    task: schemas.TaskCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_project = crud.get_project(db, project_id=project_id, user_id=current_user.id)
    if db_project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or not owned by user")
    return crud.create_task(db=db, task=task, project_id=project_id)

@router.get("/{project_id}/tasks", response_model=List[schemas.Task])
def read_tasks_for_project(
    project_id: UUID,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_project = crud.get_project(db, project_id=project_id, user_id=current_user.id)
    if db_project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or not owned by user")
    tasks = crud.get_tasks(db, project_id=project_id, skip=skip, limit=limit)
    return tasks

@router.get("/{project_id}/tasks/{task_id}", response_model=schemas.Task)
def read_task_for_project(
    project_id: UUID,
    task_id: UUID,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_project = crud.get_project(db, project_id=project_id, user_id=current_user.id)
    if db_project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or not owned by user")
    db_task = crud.get_task(db, task_id=task_id, project_id=project_id)
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found in this project")
    return db_task

@router.put("/{project_id}/tasks/{task_id}", response_model=schemas.Task)
def update_task_for_project(
    project_id: UUID,
    task_id: UUID,
    task: schemas.TaskUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_project = crud.get_project(db, project_id=project_id, user_id=current_user.id)
    if db_project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or not owned by user")
    db_task = crud.update_task(db, task_id=task_id, project_id=project_id, task_update=task)
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found in this project")
    return db_task

@router.delete("/{project_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_for_project(
    project_id: UUID,
    task_id: UUID,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_project = crud.get_project(db, project_id=project_id, user_id=current_user.id)
    if db_project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or not owned by user")
    success = crud.delete_task(db, task_id=task_id, project_id=project_id)
    if success is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found in this project")
    return
