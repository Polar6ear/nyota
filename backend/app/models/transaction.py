from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"
    id           = Column(Integer, primary_key=True, index=True)
    event_id     = Column(Integer, ForeignKey("events.id"), nullable=False)
    sender_naam  = Column(String(100), nullable=False)
    sender_gaon  = Column(String(100), nullable=True)
    sender_phone = Column(String(15), nullable=True)
    amount       = Column(Float, nullable=False)
    message      = Column(String(300), nullable=True)
    created_at   = Column(DateTime, default=datetime.utcnow)
    event        = relationship("Event", back_populates="transactions")