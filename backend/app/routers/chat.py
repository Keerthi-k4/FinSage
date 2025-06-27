# app/routers/chat.py

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func  # ✅ MISSING IMPORT FIXED
from app.database import get_db
from app.models import Transaction

router = APIRouter()

class ChatQuery(BaseModel):
    query: str

@router.post("/chat-query")
def chat_query(request: ChatQuery, db: Session = Depends(get_db)):
    query = request.query.lower()

    if "total" in query or "spent" in query:
        total = db.query(Transaction).with_entities(func.sum(Transaction.amount)).scalar()
        return {"response": f"You have spent a total of ₹{total:.2f}"}
    elif "food" in query:
        total = db.query(Transaction).filter(Transaction.category == "Food")\
                 .with_entities(func.sum(Transaction.amount)).scalar()
        return {"response": f"You spent ₹{total:.2f} on food"}
    else:
        return {"response": "Sorry, I didn't understand that yet. Ask about total spent or food category."}
