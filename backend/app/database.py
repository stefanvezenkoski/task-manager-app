import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/taskdb"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Object-Relational Mapping osnova
Base = declarative_base()

#dependency inection koj dava db sesija na sekoj endpoint
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()