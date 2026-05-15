from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from app.core.database import Base, engine
from app.models import user, event, transaction
from app.routes import auth, events, transactions

import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    docs_url="/docs",
    # Swagger mein Authorize button dikhega
    swagger_ui_oauth2_redirect_url="/oauth2-redirect",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("qr_codes", exist_ok=True)
app.mount("/qr_codes", StaticFiles(directory="qr_codes"), name="qr_codes")

app.include_router(auth.router)
app.include_router(events.router)

@app.get("/", tags=["Health"])
def root():
    return {"app": settings.APP_NAME, "status": "running ✅", "docs": "/docs"}