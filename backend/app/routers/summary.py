from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Transaction

router = APIRouter()

@router.get("/summary")
def get_summary(user_id: int = Query(..., description="User ID"), db: Session = Depends(get_db)):
    try:
        # Check if user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get transactions for user
        transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()

        if not transactions:
            return {"summary": {}}

        # Summarize by category
        summary = {}
        for transaction in transactions:
            category = transaction.category if transaction.category else "Uncategorized"
            if category not in summary:
                summary[category] = 0
            summary[category] += transaction.amount

        return {"summary": summary}
    except Exception as e:
        print(f"🔥 Error in /summary endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")