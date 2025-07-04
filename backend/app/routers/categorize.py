from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction
from mistralai.client import MistralClient
import os

router = APIRouter()

# ✅ Get Mistral API key from env
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "GhbNGnton8zI6JkPlBx8oM1l5RqHRlC1")
client = MistralClient(api_key=MISTRAL_API_KEY)

class CategorizeRequest(BaseModel):
    transaction_id: int

def categorize_with_mistral(description: str) -> str:
    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful assistant that classifies financial transactions. "
                "Given a transaction description, reply with only one word that best represents its category. "
                "Examples: Food, Rent, Groceries, Fuel, Subscription, Travel, Utilities, Shopping, Insurance, Misc."
            )
        },
        {
            "role": "user",
            "content": f"Classify this transaction: '{description}'"
        }
    ]
    response = client.chat(
        model="mistral-medium",
        messages=messages
    )
    return response.choices[0].message.content.strip().split()[0]  # Ensures it's one word


@router.post("/categorize")
def categorize_transaction(data: CategorizeRequest, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == data.transaction_id).first()
    if not transaction:
        return {"error": "Transaction not found"}

    description = transaction.description
    predicted_category = categorize_with_mistral(description)

    transaction.category = predicted_category
    db.commit()
    db.refresh(transaction)

    return {
        "message": f"Categorized as {predicted_category}",
        "transaction": {
            "id": transaction.id,
            "description": transaction.description,
            "category": transaction.category
        }
    }
