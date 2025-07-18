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

    # Get all transactions for the user
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()

    if not transactions:
        return {"response": "No transactions found for this user."}

    # Compute total and category-wise spending
    total_spent = sum(tx.amount for tx in transactions)
    
    # Summarize by category
    category_totals = {}
    for tx in transactions:
        cat = tx.category or "Uncategorized"
        category_totals[cat] = category_totals.get(cat, 0) + tx.amount

    # Sort categories by spending
    sorted_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)

    # Format the spending summary
    spending_summary = f"Total spending: ₹{total_spent:.2f}\n"
    spending_summary += "Spending by category:\n"
    for cat, amt in sorted_categories:
        spending_summary += f" - {cat}: ₹{amt:.2f}\n"

    # Optionally include latest N transactions (for granularity)
    recent_transactions = sorted(transactions, key=lambda t: t.date, reverse=True)[:5]
    transaction_list = "\n".join(
        f"{t.date.strftime('%Y-%m-%d')}: ₹{t.amount:.2f} on {t.category or 'Uncategorized'} ({t.description or 'No description'})"
        for t in recent_transactions
    )

    # Build full system context
    context_text = (
        "You are a helpful finance assistant. "
        "Here is the user's financial summary:\n\n"
        f"{spending_summary}\n"
        "Here are the 5 most recent transactions:\n"
        f"{transaction_list}\n\n"
        "Based on this, answer the user's query in a helpful, friendly, and concise way."
    )

    # Get LLM response
    llm_response = generate_mistral_response(context_text, request.query)
    return {"response": llm_response}
