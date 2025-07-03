from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Transaction
from mistralai.client import MistralClient
import os

router = APIRouter()

# ✅ Correct API key environment variable usage
MISTRAL_API_KEY = os.getenv("GhbNGnton8zI6JkPlBx8oM1l5RqHRlC1", "GhbNGnton8zI6JkPlBx8oM1l5RqHRlC1")
client = MistralClient(api_key=MISTRAL_API_KEY)

class ChatQuery(BaseModel):
    user_id: int
    query: str

def generate_mistral_response(system_content: str, user_content: str):
    messages = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": user_content}
    ]

    response = client.chat(
        model="mistral-medium",  # or "mistral-small" or "mistral-large"
        messages=messages
    )
    return response.choices[0].message.content

@router.post("/chat-query")
def chat_query(request: ChatQuery, db: Session = Depends(get_db)):
    user_id = request.user_id
    query = request.query.lower()

    # Filter transactions for this user
    user_transactions = db.query(Transaction).filter(Transaction.user_id == user_id)

    total_spent = user_transactions.with_entities(func.sum(Transaction.amount)).scalar() or 0
    food_spent = user_transactions.filter(Transaction.category == "Food")\
                                  .with_entities(func.sum(Transaction.amount)).scalar() or 0

    # Create context for Mistral
    context_text = (
        f"The user has spent a total of ₹{total_spent:.2f}. "
        f"They spent ₹{food_spent:.2f} on food. "
        "Please answer the user's question in a clear, friendly, and helpful way."
    )

    llm_response = generate_mistral_response(context_text, request.query)
    return {"response": llm_response}