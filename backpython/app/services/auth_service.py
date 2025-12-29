from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.models.usuarios import Usuarios
from app.models.verificaciones import Verificaciones
from app.models.codigosconfirmacion import Codigosconfirmacion
from app.schemas.auth import rol_from_ordinal, rol_to_ordinal
from app.utils.jwt import create_access_token, expiration_seconds
from datetime import datetime, timezone

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(plain, hashed)
    except Exception:
        return plain == hashed

def login(db: Session, email: str, password: str):
    user: Usuarios | None = db.query(Usuarios).filter(Usuarios.email == email).first()
    if not user:
        return None, "Usuario no encontrado"
    if not user.estado:
        return None, "Usuario inactivo"
    if not verify_password(password, user.password):
        return None, "Credenciales incorrectas"
    if bool(user.a2f):
        return {"token": None, "user": None, "mensaje": "CONFIRMACION_REQUERIDA"}, None

    rol = rol_from_ordinal(int(user.rol)) if user.rol is not None else None
    token = create_access_token(int(user.id), user.email, rol.value if rol else "")
    return {"token": token, "user": {"id": int(user.id), "email": user.email, "rol": rol.value if rol else ""}}, None

def confirmar_a2f(db: Session, email: str, codigo: str):
    # try codigosconfirmacion with vencimiento first, else verificaciones
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    cc = db.query(Codigosconfirmacion).filter(Codigosconfirmacion.email == email, Codigosconfirmacion.codigo == codigo).first()
    if cc:
        if getattr(cc, "vencimiento", None) and cc.vencimiento < now:
            return None, "Código expirado"
        # ok -> delete
        db.delete(cc); db.commit()
    else:
        ver = db.query(Verificaciones).filter(Verificaciones.email == email, Verificaciones.codigo == codigo).first()
        if not ver:
            return None, "Código inválido"
        db.delete(ver); db.commit()

    user: Usuarios | None = db.query(Usuarios).filter(Usuarios.email == email).first()
    if not user:
        return None, "Usuario no encontrado"
    rol = rol_from_ordinal(int(user.rol)) if user.rol is not None else None
    token = create_access_token(int(user.id), user.email, rol.value if rol else "")
    return {"token": token, "user": {"id": int(user.id), "email": user.email, "rol": rol.value if rol else ""}}, None
