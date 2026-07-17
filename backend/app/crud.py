from sqlalchemy.orm import Session

from . import models, schemas
def get_tasks(db: Session, search: str = None, priority: str = None):

    if search:
        query = db.filter(models.Task.title.ilike(f"%{search}%"))

    if priority:
        query = db.filter(models.Task.priority == priority)

    return db.query(models.Task).order_by(models.Task.id.desc()).all()

def get_task(db: Session, task_id : int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_stats(db: Session):
    total = db.query(models.Task).count()
    completed = db.query(models.Task).filter(models.Task.completed == True).count()
    return {"total": total, "completed": completed, "remaining": total - completed, "completion_rate": (completed / total * 100) if total > 0 else 0}

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(title=task.title, description=task.description, priority=task.priority, due_date=task.due_date)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task: schemas.TaskUpdate):
    db_task = get_task(db, task_id)
    if not db_task:
        return None

    update_data = task.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if not db_task:
        return None

    db.delete(db_task)
    db.commit()
    return db_task

def toggle_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)

    if not db_task:
        return None

    db_task.completed = not db_task.completed
    db.commit()
    db.refresh(db_task)
    return db_task
  