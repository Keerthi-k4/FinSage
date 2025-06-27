from fastapi import FastAPI, Depends
from . import models, database
from .routers import users, transactions, summary, categorize, chat
from fastapi import FastAPI
from app.routers import transactions  # 👈 import your router file
from app import schemas  # 👈 only needed if schemas used directly here
from app.database import get_db
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, crud  # if used

# Auto-create DB tables
models.Base.metadata.create_all(bind=database.engine)

# Create the FastAPI app
app = FastAPI()

# Include all routers
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(summary.router)
app.include_router(categorize.router)
app.include_router(chat.router)



@app.post("/transactions", response_model=schemas.Transaction)
def create_transaction_endpoint(
    tx: schemas.TransactionCreate,
    db: Session = Depends(get_db)
):
    return crud.create_transaction(db, tx)
