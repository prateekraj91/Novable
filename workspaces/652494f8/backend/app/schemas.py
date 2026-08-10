from pydantic import BaseModel, Field
from typing import Optional, List
import datetime
import uuid
from enum import Enum

class TaskStatus(str, Enum):
    to_do = "To Do"
    in_progress = "In Progress"
    done = "Done"

class TaskPriority(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    urgent = "Urgent"

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: TaskStatus = Field(TaskStatus.to_do)
    priority: TaskPriority = Field(TaskPriority.low)

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: uuid.UUID
    project_id: uuid.UUID
    created_by_id: uuid.UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True