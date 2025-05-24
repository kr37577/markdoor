from sqlalchemy.orm import Session
from ..models import database_models, schemas


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
