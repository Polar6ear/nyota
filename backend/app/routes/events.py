from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.event import Event
from app.schemas.event import EventCreate, EventResponse, EventPublic
from app.utils.qr import generate_qr

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("/create", response_model=EventResponse, status_code=201)
def create_event(
    data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Event banao
    event = Event(
        host_id=current_user.id,
        event_naam=data.event_naam,
        dulha_dulhan=data.dulha_dulhan,
        event_date=data.event_date,
        venue=data.venue,
        upi_id=data.upi_id,
        upi_naam=data.upi_naam
    )
    db.add(event)
    db.commit()
    db.refresh(event)

    # QR generate karo
    qr_path = generate_qr(event.id)
    event.qr_code_path = qr_path
    db.commit()
    db.refresh(event)

    return event


@router.get("/my-events", response_model=List[EventResponse])
def get_my_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Host ke saare events"""
    return db.query(Event)\
             .filter(Event.host_id == current_user.id)\
             .order_by(Event.created_at.desc())\
             .all()


@router.get("/{event_id}/public", response_model=EventPublic)
def get_event_public(event_id: int, db: Session = Depends(get_db)):
    """Guest ke liye — no login needed"""
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.is_active == True
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event nahi mila")
    return event


@router.get("/{event_id}", response_model=EventResponse)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Host apna event dekhe"""
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.host_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event nahi mila")
    return event


@router.get("/{event_id}/qr")
def download_qr(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """QR code image download karo"""
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.host_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event nahi mila")
    if not event.qr_code_path or not os.path.exists(event.qr_code_path):
        raise HTTPException(status_code=404, detail="QR code nahi mila")

    return FileResponse(
        event.qr_code_path,
        media_type="image/png",
        filename=f"nyota_qr_{event_id}.png"
    )


@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Event deactivate karo"""
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.host_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event nahi mila")
    event.is_active = False
    db.commit()
    return {"message": "Event deactivate ho gaya"}