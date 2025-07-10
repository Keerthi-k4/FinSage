from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
from datetime import datetime

# User schemas

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True

# Transaction schemas
class TransactionCreate(BaseModel):
    user_id: int
    amount: float
    description: str
    date: datetime
    method: str

class Transaction(BaseModel):
    id: int
    user_id: int
    amount: float
    description: str
    date: date
    method: str
    category: Optional[str] = None

    class Config:
        orm_mode = True