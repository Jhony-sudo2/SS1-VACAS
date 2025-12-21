from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.dependencies import get_db
from api.v1.services.auth_service import AuthService
from api.v1.schemas.Login import LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])
from api.v1.schemas.AuthSchema import LoginRequest, ConfirmarA2FRequest, AuthResponse
service = AuthService()

@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return service.login(payload.email, payload.password, db)

@router.post("/login/a2f", response_model=AuthResponse)
def confirmar_correo(payload: ConfirmarA2FRequest, db: Session = Depends(get_db)):
    return service.confirmar_a2f(payload.email, payload.codigo, db)