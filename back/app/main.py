from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import database
from .routers import tasks
from .models import database_models


# Initialize the database connection
database_models.Base.metadata.create_all(bind=database.engine)


# Create the FastAPI application instance
app = FastAPI(
    title="Todo API",
    description="A simple API for managing tasks",
    version="1.0.0",
)


# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include the tasks router
app.include_router(tasks.router)


# Define a root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Todo API!"}
