from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..crud import tasks as crud_tasks
from ..models import schemas
from ..database import database


router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],)


# Create a new task
@router.post("/", response_model=schemas.Task, status_code=201)
def create_new_task(
    task: schemas.TaskCreate,
    db: Session = Depends(database.get_db),
):
    return crud_tasks.create_task(db=db, task=task)


#
@router.get("/", response_model=List[schemas.Task])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    completed: bool = None,
    db: Session = Depends(database.get_db),
):
    tasks = crud_tasks.get_tasks(
        db=db, skip=skip, limit=limit, completed=completed)
    return tasks
