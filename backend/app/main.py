from .database import engine, Base
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from .routers import users  # Import the users router

from . import schemas, models, crud, database

app = FastAPI()
app.include_router(users.router) 

# Auto-create tables
models.Base.metadata.create_all(bind=database.engine)

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/transactions", response_model=schemas.Transaction)
def create_transaction_endpoint(
    tx: schemas.TransactionCreate,
    db: Session = Depends(get_db)
):
    return crud.create_transaction(db, tx)
