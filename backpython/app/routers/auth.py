from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import Login, AuthResponse, UserDto, ConfirmarCorreoRequest, rol_from_ordinal
from app.services.auth_service import login as svc_login, confirmar_a2f
from app.utils.jwt import expiration_seconds

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=AuthResponse)
def login(payload: Login, db: Session = Depends(get_db)):
    res, err = svc_login(db, payload.email, payload.password)
    if err:
        raise HTTPException(status_code=401, detail=err)
    if res["token"] is None:
        return AuthResponse(accessToken=None, tokenType="Bearer", expiresIn=expiration_seconds(), user=None, mensaje=res.get("mensaje"))
    u = res["user"]
    return AuthResponse(
        accessToken=res["token"],
        tokenType="Bearer",
        expiresIn=expiration_seconds(),
        user=UserDto(id=u["id"], email=u["email"], rol=u["rol"]),
        mensaje=None
    )

@router.post("/login/a2f", response_model=AuthResponse)
def login_a2f(payload: ConfirmarCorreoRequest, db: Session = Depends(get_db)):
    res, err = confirmar_a2f(db, payload.email, payload.codigo)
    if err:
        raise HTTPException(status_code=400, detail=err)
    u = res["user"]
    return AuthResponse(
        accessToken=res["token"],
        tokenType="Bearer",
        expiresIn=expiration_seconds(),
        user=UserDto(id=u["id"], email=u["email"], rol=u["rol"]),
        mensaje=None
    )
