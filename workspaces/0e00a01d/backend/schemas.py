from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class User(UserInDB):
    projects: List["Project"] = []
    assigned_tasks: List["Task"] = []

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectInDB(ProjectBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Project(ProjectInDB):
    owner: UserInDB # This might be User, depending on how much detail you want to expose
    tasks: List["Task"] = []

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "To Do" # Default status
    priority: Optional[str] = "Medium" # Default priority
    due_date: Optional[date] = None

class TaskCreate(TaskBase):
    assigned_to_user_id: Optional[UUID] = None

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[date] = None
    assigned_to_user_id: Optional[UUID] = None

class TaskInDB(TaskBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class Task(TaskInDB):
    project: ProjectInDB # This might be Project, depending on how much detail you want to expose
    assignee: Optional[UserInDB] = None # This might be User

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None # Or user_id: Optional[UUID]

# Update forward references for type hints
User.update_forward_refs()
Project.update_forward_refs()
Task.update_forward_refs()
