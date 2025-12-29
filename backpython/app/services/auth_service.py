from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.models.usuarios import Usuarios
from app.models.verificaciones import Verificaciones
from app.models.codigosconfirmacion import Codigosconfirmacion
from app.schemas.auth import rol_from_ordinal, rol_to_ordinal
from app.utils.jwt import create_access_token, expiration_seconds
from datetime import datetime, timezone
from datetime import datetime, timedelta, timezone
from app.services.mai_service import MailService
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
mail_service = MailService()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(plain, hashed)
    except Exception:
        return plain == hashed

def login(db: Session, email: str, password: str):
    user = db.query(Usuarios).filter(Usuarios.email == email).first()
    if not user:
        return None, "El usuario no existe"
    if not user.estado:
        return None, "El usuario esta desactivado"
    if not verify_password(password, user.password):
        return None, "Credenciales incorrectas"

    if bool(user.a2f):
        codigo = mail_service.generar_codigo()

        # enviar correo (si MAIL_* está configurado)
        mail_service.enviar_codigo("CONFIRMACION A2F", user.email, codigo)

        # borrar existente email+tipo=1
        existe = (
            db.query(Codigosconfirmacion)
            .filter(Codigosconfirmacion.email == user.email, Codigosconfirmacion.tipo == 1)
            .first()
        )
        if existe:
            db.delete(existe)
            db.commit()

        venc = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=15)
        tmp = Codigosconfirmacion(email=user.email, codigo=codigo, vencimiento=venc, tipo=1)
        db.add(tmp)
        db.commit()

        return {"token": None, "user": None, "mensaje": "CONFIRMACION_REQUERIDA"}, None

    # sin a2f: token normal
    rol = rol_from_ordinal(int(user.rol)) if user.rol is not None else None
    token = create_access_token(int(user.id), user.email, rol.value if rol else "")
    return {"token": token, "user": {"id": int(user.id), "email": user.email, "rol": rol.value if rol else ""}}, None

def confirmar_a2f(db: Session, email: str, codigo: str):
    user: Usuarios | None = db.query(Usuarios).filter(Usuarios.email == email).first()
    if not user:
        return None, "El usuario no existe"

    cc = (
        db.query(Codigosconfirmacion)
        .filter(Codigosconfirmacion.email == email, Codigosconfirmacion.tipo == 1)
        .first()
    )
    if not cc:
        return None, "El usuario no existe"  # igual que Java (aunque el mensaje sea confuso)

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if getattr(cc, "vencimiento", None) and cc.vencimiento < now:
        return None, "Código expirado"

    if codigo != cc.codigo:
        return None, "Codigo incorrecto"

    db.delete(cc)
    db.commit()

    rol = rol_from_ordinal(int(user.rol)) if user.rol is not None else None
    token = create_access_token(int(user.id), user.email, rol.value if rol else "")
    return {"token": token, "user": {"id": int(user.id), "email": user.email, "rol": rol.value if rol else ""}}, None