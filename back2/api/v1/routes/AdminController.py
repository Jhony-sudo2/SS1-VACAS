from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from core.dependencies import get_db
from api.v1.services.admin_service import AdminService
from api.v1.schemas.Area import AreaSchema


router = APIRouter(prefix="/admin", tags=["admin"])
servicio = AdminService()

@router.post("/area")
def guardar_area(data:AreaSchema,db:Session = Depends(get_db)):
    return servicio.saveArea(db,data)