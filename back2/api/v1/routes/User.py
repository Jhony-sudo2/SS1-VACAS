from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.dependencies import get_db
from api.v1.services.UserService import UsuarioService
from api.v1.schemas.UserCreate import UserCreate,EmpleadoOut
from api.v1.schemas.confimar_correo import ConfirmarCorreoRequest
from api.v1.schemas.confimar_correo import UpdateEstado


router = APIRouter(prefix="/user", tags=["user"])
service = UsuarioService()

@router.post("")
def save_user(payload: UserCreate, db: Session = Depends(get_db)):
    service.save_usuario(db, payload)
    return {"message": "Usuario creado. Revisa tu correo para confirmar."}

@router.post("/confirmarCorreo")
def confirmar_correo(payload: ConfirmarCorreoRequest, db: Session = Depends(get_db)):
    service.confirmar_correo(db, payload.codigo)
    return {"message": "Correo confirmado correctamente"}

@router.put("/actualizarEstado")
def actualizar_estado(payload: UpdateEstado, db: Session = Depends(get_db)):
    service.update_estado(db, payload.id)
    return {"message": "Estado actualizado"}

@router.get("",response_model=EmpleadoOut)
def get_empleado_by_id(id: int, db: Session = Depends(get_db)):
    return service.find_empleado_by_id(db, id)