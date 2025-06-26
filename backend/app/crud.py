# backend/app/crud.py

from sqlalchemy.orm import Session
from . import models, schemas

def create_transaction(db: Session, tx: schemas.TransactionCreate):
    db_tx = models.Transaction(**tx.dict())
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx
