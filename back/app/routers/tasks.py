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


# Retrieve all tasks
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


# Retrieve a task by ID
@router.get("/{task_id}", response_model=schemas.Task)
def read_task(task_id: int, db: Session = Depends(database.get_db)):
    task = crud_tasks.get_task(db=db, task_id=task_id)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task


# Update a task by ID
@router.put("/{task_id}", response_model=schemas.Task)
def update_existing_task(task_id: int,
                         task_update_data: schemas.TaskUpdate,
                         db: Session = Depends(database.get_db)):
    update_task = crud_tasks.update_task(
        db=db, task_id=task_id, task_update_data=task_update_data)
    if update_task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return update_task


@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def remove_task(task_id: int, db: Session = Depends(database.get_db)):
    deleted_task = crud_tasks.delete_task(db=db, task_id=task_id)
    if deleted_task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return {"detail": f"Task with id{task_id} deleted successfully"}
