from __future__ import annotations

from typing import List
from fastapi import Query

from fastapi import APIRouter, Depends, HTTPException
from pydantic import Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.areas import Areas
from app.models.servicios import Servicios
from app.models.asignacionservicio import Asignacionservicio
from app.schemas.common import CamelModel
from app.utils.s3 import upload_base64_to_s3
from app.schemas.generated import AreasSchema, ServiciosSchema

router = APIRouter(prefix="/admin", tags=["admin"])


class AsignarServicio(CamelModel):
    area_id: int = Field(..., alias="areaId")
    servicios: List[int]


@router.post("/area", response_model=AreasSchema)
def save_area(payload: AreasSchema, db: Session = Depends(get_db)):
    imagen_url = upload_base64_to_s3(
        getattr(payload, "imagen", None),
        key_prefix="Fotos"
    )
    data = payload.model_dump(exclude_unset=True)
    data["imagen"] = imagen_url
    area = Areas(**data)
    db.add(area)
    db.commit()
    db.refresh(area)
    return area


@router.post("/servicio", response_model=ServiciosSchema)
def save_servicio(payload: ServiciosSchema, db: Session = Depends(get_db)):

    imagen_url = upload_base64_to_s3(
        getattr(payload, "imagen", None),
        key_prefix=f"servicio_{payload.nombre or 'servicio'}"
    )

    data = payload.model_dump(exclude_unset=True)  # Pydantic v2
    data["imagen"] = imagen_url  # URL o None (nunca base64)

    servicio = Servicios(**data)  # instancia ORM
    db.add(servicio)
    db.commit()
    db.refresh(servicio)
    return servicio


@router.post("/servicios/asignar")
def asignar_servicios(payload: AsignarServicio, db: Session = Depends(get_db)):
    area = db.query(Areas).filter(Areas.id == payload.area_id).first()
    if not area:
        raise HTTPException(status_code=404, detail="Area no encontrada")

    for sid in payload.servicios:
        serv = db.query(Servicios).filter(Servicios.id == sid).first()
        if not serv:
            raise HTTPException(status_code=404, detail="Servicio no encontrado")
        existe = db.query(Asignacionservicio).filter(
            Asignacionservicio.area_id == payload.area_id,
            Asignacionservicio.servicio_id == sid,
        ).first()
        if not existe:
            db.add(Asignacionservicio(area_id=payload.area_id, servicio_id=sid))

    db.commit()
    return {"ok": True}

