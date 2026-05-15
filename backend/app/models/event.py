from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Event(Base):
    __tablename__ = "events"
    id           = Column(Integer, primary_key=True, index=True)
    host_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_naam   = Column(String(200), nullable=False)
    dulha_dulhan = Column(String(200), nullable=False)
    event_date   = Column(Date, nullable=False)
    venue        = Column(String(300), nullable=True)
    upi_id       = Column(String(100), nullable=False)
    upi_naam     = Column(String(100), nullable=False)
    qr_code_path = Column(String(300), nullable=True)
    is_active    = Column(Boolean, default=True)
    created_at   = Column(DateTime, default=datetime.utcnow)
    host         = relationship("User", back_populates="events")
    transactions = relationship("Transaction", back_populates="event")