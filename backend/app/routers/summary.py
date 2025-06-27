# app/routers/summary.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction
from sqlalchemy import func

router = APIRouter()

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    results = db.query(Transaction.category, func.sum(Transaction.amount))\
                .group_by(Transaction.category).all()

    summary = {category: total for category, total in results if category}
    return {"summary": summary}