from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from core.dependencies import get_db
from api.v1.services.general_service import GeneralService


router = APIRouter(prefix="/general", tags=["general"])
servicio = GeneralService()

@router.get("/areas")
def get_all_Areas(db:Session = Depends(get_db)):
    return servicio.get_all_areas(db)