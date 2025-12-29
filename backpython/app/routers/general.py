from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.areas import Areas
from app.models.servicios import Servicios
from app.models.asignacionservicio import Asignacionservicio
from app.schemas.generated import AreasSchema, ServiciosSchema

router = APIRouter(prefix="/general", tags=["general"])


@router.get("/areas", response_model=List[AreasSchema])
def get_all_areas(db: Session = Depends(get_db)):
    return db.query(Areas).order_by(Areas.id.asc()).all()


@router.get("/servicios", response_model=List[ServiciosSchema])
def get_all_servicios(db: Session = Depends(get_db)):
    return db.query(Servicios).order_by(Servicios.id.asc()).all()


@router.get("/area/servicios", response_model=List[ServiciosSchema])
def get_servicios_asignados(areaId: int = Query(...), db: Session = Depends(get_db)):
    area = db.query(Areas).filter(Areas.id == areaId).first()
    if not area:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    servicio_ids = [int(r.servicio_id) for r in db.query(Asignacionservicio).filter(Asignacionservicio.area_id == areaId).all()]
    if not servicio_ids:
        return []
    return db.query(Servicios).filter(Servicios.id.in_(servicio_ids)).all()
