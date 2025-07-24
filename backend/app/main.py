from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, database
from .routers import users, transactions, summary, categorize, chat, forecast, ocr
from . import schemas, crud
from .database import get_db

# ✅ Auto-create DB tables
models.Base.metadata.create_all(bind=database.engine)

# ✅ Create FastAPI app
app = FastAPI()

# ✅ Add CORS middleware here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include routers
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(summary.router)
app.include_router(categorize.router)
app.include_router(chat.router)
app.include_router(forecast.router)
app.include_router(ocr.router)

# Optional: Direct endpoint if not using router
@app.post("/transactions", response_model=schemas.Transaction)
def create_transaction_endpoint(
    tx: schemas.TransactionCreate,
    db: Session = Depends(get_db)
):
    return crud.create_transaction(db, tx)
