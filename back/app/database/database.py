from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# sqlite database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./todo_db.sqlite"

# Create the database engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for declarative models
Base = declarative_base()


# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
