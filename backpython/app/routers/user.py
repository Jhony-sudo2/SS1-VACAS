from fastapi import APIRouter, Depends, HTTPException, Query,Body
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.usuarios import Usuarios
from app.models.pacientes import Pacientes
from app.models.empleados import Empleados
from app.models.verificaciones import Verificaciones
from app.models.codigosconfirmacion import Codigosconfirmacion
from app.schemas.auth import UpdateEstado, UpdatePass, RecuperarContrasenia, ConfirmarCodigo, ConfirmarCorreoRequest,UpdatePassword, rol_from_ordinal, rol_to_ordinal
from app.schemas.user import UsuarioCreate, UsuarioOut, PacienteDTO, EmpleadoOut,PacienteOut
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import secrets
from app.schemas.generated import UsuariosSchema

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/user", tags=["user"])

def user_to_out(u: UsuariosSchema) -> UsuarioOut:
    rol = rol_from_ordinal(int(u.rol)) if u.rol is not None else None
    return UsuarioOut(
        id=int(u.id),
        email=u.email,
        rol=rol,
        estado=bool(u.estado),
        a2f=bool(u.a2f),
        email_verificado=bool(u.email_verificado),
    )

@router.get("", response_model=list[UsuarioOut])
def listar(db: Session = Depends(get_db)):
    users = db.query(Usuarios).all()
    return [user_to_out(u) for u in users]

@router.post("", response_model=UsuarioOut)
def crear(payload: UsuarioCreate, db: Session = Depends(get_db)):
    if db.query(Usuarios).filter(Usuarios.email == payload.email).first():
        raise HTTPException(status_code=409, detail="Email ya existe")
    hashed = pwd_context.hash(payload.password)
    u = Usuarios(
        email=payload.email,
        password=hashed,
        rol=rol_to_ordinal(payload.rol),
        a2f=payload.a2f,
        estado=payload.estado,
        email_verificado=payload.email_verificado,
        codigo_verificacion=None,
        codigo_verificacion_expira=None,
    )
    db.add(u); db.commit(); db.refresh(u)
    return user_to_out(u)

@router.put("/actualizarEstado")
def actualizar_estado(payload: UpdateEstado, db: Session = Depends(get_db)):
    u = db.query(Usuarios).filter(Usuarios.id == payload.id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    u.estado = not u.estado
    db.commit()
    db.refresh(u)
    return {"ok": True, "estado": u.estado}

@router.put("/password")
def update_password(payload: UpdatePassword, db: Session = Depends(get_db)):
    u = db.query(Usuarios).filter(Usuarios.id == payload.usuarioId).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if not pwd_context.verify(payload.actual, u.password):
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")

    if pwd_context.verify(payload.nueva, u.password):
        raise HTTPException(status_code=400, detail="La nueva contraseña no puede ser igual a la actual")

    u.password = pwd_context.hash(payload.nueva)
    db.commit()
    db.refresh(u)

    return {"ok": True}

@router.put("/password/cambiar")
def cambiar_contrasenia(payload: UpdatePass, db: Session = Depends(get_db)):
    # Spring tiene mismo comportamiento: cambioPassword(email,nueva)
    return update_password(payload, db)

@router.post("/recuperarcontrasenia")
def recuperar(payload: RecuperarContrasenia, db: Session = Depends(get_db)):
    u = db.query(Usuarios).filter(Usuarios.email == payload.email).first()
    if not u:
        # no revelar existencia
        return {"mensaje": "Si el correo existe, se envió un código"}
    codigo = str(secrets.randbelow(900000) + 100000)
    expira = datetime.utcnow() + timedelta(minutes=15)
    u.codigo_verificacion = codigo
    u.codigo_verificacion_expira = expira
    db.commit()
    # Aquí iría envío correo (MailService). Lo dejamos como no bloqueante.
    return {"mensaje": "Código generado"}

@router.post("/confirmarcodigo")
def confirmar_codigo(payload: ConfirmarCodigo, db: Session = Depends(get_db)):
    u = db.query(Usuarios).filter(Usuarios.email == payload.email).first()
    if not u or not u.codigo_verificacion:
        raise HTTPException(status_code=400, detail="Código inválido")
    if u.codigo_verificacion != payload.codigo:
        raise HTTPException(status_code=400, detail="Código inválido")
    if u.codigo_verificacion_expira and u.codigo_verificacion_expira < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Código expirado")
    return {"ok": True}

@router.post("/confirmarCorreo")
def confirmar_correo(payload: ConfirmarCorreoRequest, db: Session = Depends(get_db)):
    # similar a auth/login/a2f pero marca email_verificado
    u = db.query(Usuarios).filter(Usuarios.email == payload.email).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    # check in verificaciones
    ver = db.query(Verificaciones).filter(Verificaciones.email == payload.email, Verificaciones.codigo == payload.codigo).first()
    if not ver:
        raise HTTPException(status_code=400, detail="Código inválido")
    db.delete(ver)
    u.email_verificado = True
    db.commit()
    return {"ok": True}

@router.get("/paciente")
def listar_pacientes(db: Session = Depends(get_db)):
    rows = db.query(Pacientes).all()
    return rows

@router.get("/empleado")
def listar_empleados(db: Session = Depends(get_db)):
    rows = db.query(Empleados).all()
    return rows

@router.put("/paciente")
def actualizar_paciente(id: int = Query(...), payload: PacienteOut = None, db: Session = Depends(get_db)):
    p = db.query(Pacientes).filter(Pacientes.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    p.nombre = payload.nombre
    p.fecha_nacimiento = payload.fechaNacimiento
    p.genero = payload.genero
    p.estado_civil = payload.estadoCivil
    p.telefono = payload.telefono
    p.direccion = payload.direccion
    u = db.query(Usuarios).filter(Usuarios.id == p.usuario_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    u.a2f = payload.usuario.a2f
    db.commit()
    db.refresh(u)
    db.refresh(p)
    return {"ok": True}

@router.put("/empleado")
def actualizar_empleado(
    payload: EmpleadoOut = Body(...),
    db: Session = Depends(get_db)
):
    e = db.query(Empleados).filter(Empleados.id == payload.id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    e.nombre = payload.nombre
    print(payload.fechaNacimiento)
    e.fecha_nacimiento = payload.fechaNacimiento
    print(e.fecha_nacimiento)
    e.genero = payload.genero
    e.estado_civil = payload.estadoCivil
    e.telefono = payload.telefono
    e.colegiado = payload.colegiado
    u = db.query(Usuarios).filter(Usuarios.id == e.usuario_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    u.a2f = payload.usuario.a2f
    db.commit()
    db.refresh(e)
    db.refresh(u)
    return {"ok": True}

@router.get("/paciente/id", response_model=PacienteOut)
def find_paciente_by_usuario_id(id: int = Query(...), db: Session = Depends(get_db)):
    p = (
        db.query(Pacientes)
        .filter(Pacientes.usuario_id == id)
        .first()
    )
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return p

@router.get("/empleado/id", response_model=EmpleadoOut)
def find_empleado_by_usuario_id(id: int = Query(...), db: Session = Depends(get_db)):
    e = (
        db.query(Empleados)
        .filter(Empleados.usuario_id == id)
        .first()
    )
    if not e:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return e