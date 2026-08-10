import uuid
import datetime
from sqlalchemy import Column, String, TIMESTAMP, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base

class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.now)
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.now, onupdate=datetime.datetime.now)

    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum("To Do", "In Progress", "Done", name="task_status_enum", create_type=False), default="To Do", nullable=False)
    priority = Column(Enum("Low", "Medium", "High", "Urgent", name="task_priority_enum", create_type=False), default="Low", nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.now)
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.now, onupdate=datetime.datetime.now)

    project = relationship("Project", back_populates="tasks")