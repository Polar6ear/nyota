from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import openpyxl
import io

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.event import Event
from app.models.transaction import Transaction
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    DashboardStats
)

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/add", response_model=TransactionResponse, status_code=201)
def add_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    """Guest neuta entry karta hai — login ki zaroorat nahi"""
    event = db.query(Event).filter(
        Event.id == data.event_id,
        Event.is_active == True
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event nahi mila")
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount sahi nahi hai")

    txn = Transaction(
        event_id=data.event_id,
        sender_naam=data.sender_naam,
        sender_gaon=data.sender_gaon,
        sender_phone=data.sender_phone,
        amount=data.amount,
        message=data.message
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


@router.get("/event/{event_id}", response_model=List[TransactionResponse])
def get_transactions(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Saari transactions — sirf host dekh sakta hai"""
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.host_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=403, detail="Aapka event nahi hai")

    return db.query(Transaction)\
             .filter(Transaction.event_id == event_id)\
             .order_by(Transaction.created_at.desc())\
             .all()


@router.get("/event/{event_id}/stats", response_model=DashboardStats)
def get_stats(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Dashboard stats — total, count, highest, average"""
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.host_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=403, detail="Aapka event nahi hai")

    txns = db.query(Transaction)\
             .filter(Transaction.event_id == event_id)\
             .all()

    if not txns:
        return DashboardStats(
            total_amount=0,
            total_count=0,
            highest_amount=0,
            average_amount=0
        )

    amounts = [t.amount for t in txns]
    return DashboardStats(
        total_amount=sum(amounts),
        total_count=len(amounts),
        highest_amount=max(amounts),
        average_amount=round(sum(amounts) / len(amounts), 2)
    )


@router.get("/event/{event_id}/search", response_model=List[TransactionResponse])
def search_transactions(
    event_id: int,
    naam: Optional[str] = None,
    gaon: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Naam ya gaon se search karo"""
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.host_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=403, detail="Aapka event nahi hai")

    query = db.query(Transaction).filter(Transaction.event_id == event_id)
    if naam:
        query = query.filter(Transaction.sender_naam.ilike(f"%{naam}%"))
    if gaon:
        query = query.filter(Transaction.sender_gaon.ilike(f"%{gaon}%"))

    return query.order_by(Transaction.created_at.desc()).all()


@router.get("/event/{event_id}/by-gaon")
def get_by_gaon(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Gaon wise total amount"""
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.host_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=403, detail="Aapka event nahi hai")

    results = db.query(
        Transaction.sender_gaon,
        func.sum(Transaction.amount).label("total"),
        func.count(Transaction.id).label("count")
    ).filter(Transaction.event_id == event_id)\
     .group_by(Transaction.sender_gaon)\
     .order_by(func.sum(Transaction.amount).desc())\
     .all()

    return [
        {
            "gaon": r.sender_gaon or "Unknown",
            "total": r.total,
            "count": r.count
        }
        for r in results
    ]


@router.get("/event/{event_id}/export")
def export_excel(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Neuta register Excel mein export karo"""
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.host_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=403, detail="Aapka event nahi hai")

    txns = db.query(Transaction)\
             .filter(Transaction.event_id == event_id)\
             .order_by(Transaction.created_at.desc())\
             .all()

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Neuta Register"

    # Headers
    ws.append(["#", "Naam", "Gaon/City", "Phone", "Amount (Rs)", "Message", "Date"])

    # Data
    for i, t in enumerate(txns, 1):
        ws.append([
            i,
            t.sender_naam,
            t.sender_gaon or "",
            t.sender_phone or "",
            t.amount,
            t.message or "",
            t.created_at.strftime("%d/%m/%Y %H:%M")
        ])

    # Total row
    ws.append([
        "", "TOTAL", "", "",
        sum(t.amount for t in txns),
        "", ""
    ])

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f"attachment; filename=nyota_register_{event_id}.xlsx"
        }
    )