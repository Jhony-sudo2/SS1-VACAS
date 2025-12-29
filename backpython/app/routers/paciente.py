from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from datetime import date
from app.db.session import get_db
from app.models.pacientes import Pacientes
from app.schemas.out import PacienteOut

router = APIRouter(prefix="/paciente", tags=["paciente"])

class PacienteIn(BaseModel):
    nombre: str
    fecha_nacimiento: date | None = None
    genero: bool
    estado_civil: bool
    telefono: str | None = None
    direccion: str | None = None
    usuario_id: int | None = None

@router.get("", response_model=list[PacienteOut])
def listar(db: Session = Depends(get_db)):
    return db.query(Pacientes).options(joinedload(Pacientes.usuario)).all()

@router.post("", response_model=PacienteOut)
def crear(payload: PacienteIn, db: Session = Depends(get_db)):
    p = Pacientes(**payload.model_dump())
    db.add(p); db.commit(); db.refresh(p)
    return p

@router.get("/{id}", response_model=PacienteOut)
def get_one(id: int, db: Session = Depends(get_db)):
    p = db.query(Pacientes).options(joinedload(Pacientes.usuario)).filter(Pacientes.id==id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return p
