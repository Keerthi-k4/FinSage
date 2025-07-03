from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas
from app.models import Transaction

router = APIRouter()

@router.post("/transactions", response_model=schemas.Transaction)
def create_transaction(tx: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return crud.create_transaction(db, tx)

@router.get("/transactions")
def get_all_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()