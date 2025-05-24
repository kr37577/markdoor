from sqlalchemy.orm import Session
from ..models import database_models, schemas
from typing import Optional, List


# CRUD operations for Task creation
def create_task(db: Session, task: schemas.TaskCreate) -> database_models.Task:
    db_task = database_models.Task(
        title=task.title,
        description=task.description,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


# CRUD operations for Task retrieval by ID
def get_task(db: Session, task_id: int) -> Optional[database_models.Task]:
    return db.query(database_models.Task).filter(database_models.Task.id == task_id).first()


# CRUD operations for all tasks retrieval
def get_tasks(db: Session, skip: int = 0, limit: int = 100, completed: Optional[bool] = None) -> List[database_models.Task]:
    # query to retrieve tasks
    query = db.query(database_models.Task)
    # Filter by completion status if provided
    if completed is not None:
        query = query.filter(database_models.Task.completed == completed)
    return query.offset(skip).limit(limit).all()


# CRUD operations for Task update
def update_task(db: Session, task_id: int, task_update_data: schemas.TaskUpdate) -> Optional[database_models.Task]:
    db_task = get_task(db, task_id)
    if db_task is None:
        return None

    update_task = task_update_data.model_dump(exclude_unset=True)

    for key, value in update_task.items():
        setattr(db_task, key, value)

    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task
