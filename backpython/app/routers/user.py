from fastapi import APIRouter, Depends, HTTPException, Query,Body
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.usuarios import Usuarios
from app.models.pacientes import Pacientes
from app.models.empleados import Empleados
from app.models.verificaciones import Verificaciones
from app.models.codigosconfirmacion import Codigosconfirmacion
from app.schemas.auth import UpdateEstado, UpdatePass, RecuperarContrasenia, ConfirmarCorreoRequest,UpdatePassword, rol_from_ordinal, rol_to_ordinal
from app.schemas.user import UsuarioCreate, UsuarioOut, ConfirmarCorreoIn, EmpleadoOut,PacienteOut
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import secrets
from app.schemas.generated import UsuariosSchema
from app.services.mai_service import MailService
from fastapi import Body

mail_service = MailService()
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
    if db.query(Usuarios).filter(Usuarios.email == payload.usuario.email).first():
        raise HTTPException(status_code=400, detail="El correo electrónico ya está asociado a una cuenta")

    codigo = mail_service.generar_codigo()
    expira = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=15)

    u = Usuarios(
        email=payload.usuario.email,
        password=pwd_context.hash(payload.usuario.password),
        rol=rol_to_ordinal(payload.usuario.rol),
        a2f=payload.usuario.a2f,

        email_verificado=False,          
        estado=False,                   
        codigo_verificacion=codigo,        
        codigo_verificacion_expira=expira, 
    )
    db.add(u)
    db.commit()
    db.refresh(u)

    if payload.empleado and payload.paciente:
        raise HTTPException(status_code=400, detail="Debe enviar empleado o paciente, no ambos")

    if payload.empleado:
        aplica_igss = payload.empleado.aplicaIgss if payload.empleado.aplicaIgss is not None else False
        sueldo = payload.empleado.sueldo if payload.empleado.sueldo is not None else 0
        bono = payload.empleado.bono if payload.empleado.bono is not None else 0

        e = Empleados(
            nombre=payload.empleado.nombre,
            fecha_nacimiento=payload.empleado.fechaNacimiento,
            genero=payload.empleado.genero,
            estado_civil=payload.empleado.estadoCivil,
            telefono=payload.empleado.telefono,
            colegiado=payload.empleado.colegiado,
            aplica_igss=aplica_igss,
            sueldo=sueldo,
            bono=bono,
            usuario_id=u.id,
        )
        db.add(e)
        db.commit()

    elif payload.paciente:
        p = Pacientes(
            nombre=payload.paciente.nombre,
            fecha_nacimiento=payload.paciente.fechaNacimiento,
            genero=payload.paciente.genero,
            estado_civil=payload.paciente.estadoCivil,
            direccion=payload.paciente.direccion,
            nivel_educativo=payload.paciente.nivelEducativo,
            telefono=payload.paciente.telefono,
            persona_emergencia=payload.paciente.personaEmergencia,
            telefono_emergencia=payload.paciente.telefonoEmergencia,
            procedencia=payload.paciente.procedencia,
            usuario_id=u.id,
        )
        db.add(p)
        db.commit()
    print('pase todo')
    mail_service.enviar_codigo("Confirmacion de correo electronico", u.email, codigo)

    db.refresh(u)
    return u

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
def cambio_password(db: Session, email: str, nueva: str):
    u = db.query(Usuarios).filter(Usuarios.email == email).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if len(nueva) < 8:
        raise HTTPException(status_code=400, detail="La contraseña tiene que tener 8 caracteres")

    u.password = pwd_context.hash(nueva)
    db.commit()
    return {"ok": True}

@router.put("/password/cambiar")
def cambiar_contrasenia(payload: UpdatePass, db: Session = Depends(get_db)):
    return cambio_password(db,payload.email,payload.nueva)

@router.post("/recuperarcontrasenia")
def recuperar(payload: RecuperarContrasenia, db: Session = Depends(get_db)):
    u = db.query(Usuarios).filter(Usuarios.email == payload.email).first()
    if not u:
        # Java sí revela; si querés idéntico, devolvé 404. 
        # Si querés “más seguro”, dejalo como está.
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    codigo = mail_service.generar_codigo()
    mail_service.enviar_codigo("RECUPERAR CONTRASENIA", u.email, codigo)

    # borrar existente (email + tipo=2)
    existe = (
        db.query(Codigosconfirmacion)
        .filter(Codigosconfirmacion.email == u.email, Codigosconfirmacion.tipo == 2)
        .first()
    )
    if existe:
        db.delete(existe)
        db.commit()

    venc = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=15)
    tmp = Codigosconfirmacion(email=u.email, codigo=codigo, vencimiento=venc, tipo=2)
    db.add(tmp)
    db.commit()

    return {"ok": True}

@router.post("/confirmarCorreo")
def confirmar_correo(payload: ConfirmarCorreoIn, db: Session = Depends(get_db)):
    print(payload.codigo)
    u = db.query(Usuarios).filter(Usuarios.codigo_verificacion == payload.codigo).first()
    if not u:
        raise HTTPException(status_code=400, detail="Código de verificación inválido")

    if not u.codigo_verificacion_expira or u.codigo_verificacion_expira < datetime.utcnow():
        raise HTTPException(status_code=400, detail="El código de verificación ha expirado")

    u.email_verificado = True
    u.codigo_verificacion = None
    u.codigo_verificacion_expira = None
    u.estado = True
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