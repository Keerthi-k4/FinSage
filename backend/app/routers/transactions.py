from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas
from app.models import Transaction
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/transactions", response_model=schemas.Transaction)
def create_transaction(tx: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return crud.create_transaction(db, tx)

@router.get("/transactions", response_model=List[schemas.Transaction])
def get_all_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()

# ✅ NEW: Add single item (from receipt scanner)
@router.post("/transactions/add")
def add_transaction(item: dict, db: Session = Depends(get_db)):
    try:
        transaction = Transaction(
            user_id=1,  # Replace with actual user logic
            amount=item["price"],
            description=item["name"],
            date=datetime.now(),
            category="Uncategorized",
            method="Manual Add"
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        return {"message": "Transaction added"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ NEW: Add all items in one go
@router.post("/transactions/add-bulk")
def add_bulk_transactions(payload: dict, db: Session = Depends(get_db)):
    try:
        items = payload.get("items", [])
        for item in items:
            transaction = Transaction(
                user_id=1,
                amount=item["price"],
                description=item["name"],
                date=datetime.now(),
                category="Uncategorized",
                method="Manual Add"
            )
            db.add(transaction)
        db.commit()
        return {"message": f"{len(items)} transactions added"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
