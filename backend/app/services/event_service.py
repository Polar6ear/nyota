from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.event import Event


def create_event(data, db: Session, current_user):

    event = Event(
        host_id=current_user.id,
        event_naam=data.event_naam,
        dulha_dulhan=data.dulha_dulhan,
        event_date=data.event_date,
        venue=data.venue,
        upi_id=data.upi_id,
        upi_naam=data.upi_naam,
    )

    db.add(event)

    db.commit()

    db.refresh(event)

    return event


def get_my_events(db: Session, current_user):

    events = (
        db.query(Event)
        .filter(Event.host_id == current_user.id)
        .order_by(Event.id.desc())
        .all()
    )

    return events


def get_single_event(event_id: int, db: Session, current_user):

    event = (
        db.query(Event)
        .filter(
            Event.id == event_id,
            Event.host_id == current_user.id,
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    return event