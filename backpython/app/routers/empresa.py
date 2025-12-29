from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException,Body
from pydantic import Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.empresa import Empresa
from app.models.areas import Areas
from app.models.servicios import Servicios
from app.models.medicamentos import Medicamentos
from app.schemas.common import CamelModel
from app.utils.s3 import upload_base64_to_s3
from app.schemas.generated import AreasSchema, EmpresaSchema, MedicamentosSchema, ServiciosSchema

router = APIRouter(prefix="/empresa", tags=["empresa"])


class PrincipalDTO(CamelModel):
    empresa: EmpresaSchema
    areas: List[AreasSchema]
    servicios: List[ServiciosSchema]
    medicamentos: List[MedicamentosSchema]


@router.get("", response_model=EmpresaSchema)
def get_empresa(db: Session = Depends(get_db)):
    emp = db.query(Empresa).filter(Empresa.id == 1).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Datos de empresa no cargados")
    return emp


@router.put("", response_model=EmpresaSchema)
def update_empresa(payload: EmpresaSchema = Body(...), db: Session = Depends(get_db)):
    imagen_url = upload_base64_to_s3(
        getattr(payload, "imagen", None),
        key_prefix="Fotos"
    )

    data = payload.model_dump(exclude_unset=True)
    data["imagen"] = imagen_url

    emp_id = payload.id if payload.id and payload.id > 0 else None

    if emp_id:
        emp = db.query(Empresa).filter(Empresa.id == emp_id).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Empresa no encontrada")
        for k, v in data.items():
            setattr(emp, k, v)
    else:
        # si no mandan id (o mandan 0), intenta actualizar la primera empresa si existe
        emp = db.query(Empresa).order_by(Empresa.id.asc()).first()
        if emp:
            for k, v in data.items():
                setattr(emp, k, v)
        else:
            emp = Empresa(**data)
            db.add(emp)

    db.commit()
    db.refresh(emp)
    return emp


@router.get("/dashboard", response_model=PrincipalDTO)
def dashboard(db: Session = Depends(get_db)):
    empresa = get_empresa(db)
    areas = db.query(Areas).order_by(Areas.id.asc()).all()
    servicios = db.query(Servicios).order_by(Servicios.id.asc()).all()
    meds = db.query(Medicamentos).order_by(Medicamentos.id.asc()).all()
    return PrincipalDTO(empresa=empresa, areas=areas, servicios=servicios, medicamentos=meds)