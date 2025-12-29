from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.medicamentos import Medicamentos
from pydantic import BaseModel
from app.utils.s3 import upload_base64_to_s3
router = APIRouter(prefix="/medicamento", tags=["medicamento"])

class MedicamentoIn(BaseModel):
    nombre: str
    precio: float
    minimo: int
    stock: int
    tipo: bool
    imagen: str | None = None

class UpdateStock(BaseModel):
    id: int
    cantidad: int

@router.get("")
def listar(db: Session = Depends(get_db)):
    return db.query(Medicamentos).all()

@router.post("")
def crear(payload: MedicamentoIn, db: Session = Depends(get_db)):
    imagen_url = upload_base64_to_s3(
        getattr(payload, "imagen", None),
        key_prefix=f"medicamento_{payload.nombre or 'medicamento'}"
    )

    data = payload.model_dump(exclude_unset=True)
    data["imagen"] = imagen_url 

    m = Medicamentos(**data)
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

@router.put("")
def actualizar(id: int, payload: MedicamentoIn, db: Session = Depends(get_db)):
    m = db.query(Medicamentos).filter(Medicamentos.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")
    for k,v in payload.model_dump().items():
        setattr(m,k,v)
    db.commit()
    return m

@router.put("/stock")
def update_stock(payload: UpdateStock, db: Session = Depends(get_db)):
    m = db.query(Medicamentos).filter(Medicamentos.id == payload.id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")
    if payload.cantidad <= 0:
        raise HTTPException(status_code=406, detail="La cantidad no puede ser negativa")
    m.stock = (m.stock or 0) + payload.cantidad
    db.commit()
    return {"ok": True}
