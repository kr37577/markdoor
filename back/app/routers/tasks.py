from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..models import schemas
from ..database import database
from .. import crud

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],)


# Create a new task
@router.post("/", response_model=schemas.Task)
def create_new_task(
    task: schemas.TaskCreate,
    db: Session = Depends(database.get_db),
):
    return crud.tasks.create_task(db=db, task=task)
