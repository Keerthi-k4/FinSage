# app/routers/categorize.py

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction
import random

router = APIRouter()

class CategorizeRequest(BaseModel):
    transaction_id: int

@router.post("/categorize")
def categorize_transaction(data: CategorizeRequest, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == data.transaction_id).first()
    if not transaction:
        return {"error": "Transaction not found"}

    desc = transaction.description.lower()
    if "food" in desc:
        category = "Food"
    elif "rent" in desc or "house" in desc:
        category = "Rent"
    elif "uber" in desc or "ola" in desc:
        category = "Transport"
    else:
        category = random.choice(["Shopping", "Misc", "Health"])

    transaction.category = category
    db.commit()
    db.refresh(transaction)
    return {
        "message": f"Categorized as {category}",
        "transaction": {
            "id": transaction.id,
            "description": transaction.description,
            "category": transaction.category
        }
    }
