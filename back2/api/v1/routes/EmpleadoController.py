from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.v1.schemas.Area import AsignarArea
from core.dependencies import get_db
from api.v1.services.EmpleadoService import EmpleadoService
from api.v1.schemas.UserCreate import EmpleadoOut
from api.v1.schemas.Horario import AsignarHorario



router = APIRouter(prefix="/empleado", tags=["empleado"])
service = EmpleadoService()


@router.post("/asignarArea")
def save_user(data: AsignarArea, db: Session = Depends(get_db)):
    service.asignar_areas(db,data)
    return {"message": "Usuario creado. Revisa tu correo para confirmar."}

@router.get("",response_model=list[EmpleadoOut])
def get_all_empleados(db:Session = Depends(get_db)):
    return service.get_all_empleados(db)

@router.get("/id",response_model=EmpleadoOut)
def find_by_id(id:int,db:Session = Depends(get_db)):
    return service.find_by_id(db,id)

@router.get("/areas")
def find_areas(id:int,db:Session = Depends(get_db)):
    return service.find_areas(db,id)

@router.post("/asignarHorario")
def asignarHorario(data:list[AsignarHorario],db:Session= Depends(get_db)):
    return service.asignar_horario(db,data)

@router.get("/horario")
def getHorario(id:int,db:Session=Depends(get_db)):
    return service.get_horarios_by_empleado_id(db,id)


