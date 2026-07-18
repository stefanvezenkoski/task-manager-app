from datetime import datetime
from typing import Optional
from enum import Enum as PyEnum

from pydantic import BaseModel, ConfigDict

class PriorityEnum(str, PyEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskBase(BaseModel):
    title : str
    description : Optional[str] = None
    priority : PriorityEnum = PriorityEnum.LOW
    due_date : Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title : Optional[str] = None
    description : Optional[str] = None
    priority : Optional[PriorityEnum] = None
    due_date : Optional[datetime] = None
    completed : Optional[bool] = None

class TaskOut(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    completed:bool
    created_at: datetime