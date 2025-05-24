from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# Base Schemas
class TsskBase(BaseModel):
    title: str
    description: Optional[str] = None


# TaskCreate is used for creating a new task
class TaskCreate(TsskBase):
    pass


# TaskUpdate is used for updating an existing task
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None


# Task is used for returning a task in API responses
class Task(TsskBase):
    id: int
    is_completed: bool
    created_at: datetime

    class Config:
        orm_mode = True
