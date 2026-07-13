from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TaskBase(BaseModel):
    title : str
    description : Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title : Optional[str] = None
    description : Optional[str] = None
    completed : Optional[bool] = None

class TaskOut(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    completed:bool
    created_at: datetime