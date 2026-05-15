from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class EventCreate(BaseModel):
    event_naam: str
    dulha_dulhan: str
    event_date: date
    venue: Optional[str] = None
    upi_id: str
    upi_naam: str

class EventResponse(BaseModel):
    id: int
    event_naam: str
    dulha_dulhan: str
    event_date: date
    venue: Optional[str]
    upi_id: str
    upi_naam: str
    qr_code_path: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class EventPublic(BaseModel):
    """Guest ke liye — sirf public info"""
    id: int
    event_naam: str
    dulha_dulhan: str
    event_date: date
    venue: Optional[str]
    upi_id: str
    upi_naam: str

    class Config:
        from_attributes = True