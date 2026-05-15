from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TransactionCreate(BaseModel):
    event_id: int
    sender_naam: str
    sender_gaon: Optional[str] = None
    sender_phone: Optional[str] = None
    amount: float
    message: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    event_id: int
    sender_naam: str
    sender_gaon: Optional[str]
    sender_phone: Optional[str]
    amount: float
    message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_amount: float
    total_count: int
    highest_amount: float
    average_amount: float