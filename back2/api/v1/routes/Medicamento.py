from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from core.dependencies import get_db
from api.v1.services.medicamento_service import MedicamentoService
from api.v1.schemas.Venta import MedicamentoCreate,updateStock

router = APIRouter(prefix="/medicamento", tags=["medicamento"])
servicio = MedicamentoService()



@router.get("")
def get_all_medicamentos(db:Session = Depends(get_db)):
    return servicio.find_all(db)

@router.get("/id")
def find_by_id(id:int,db:Session=Depends(get_db)):
    return servicio.find_by_id(db,id)

@router.post("")
def save_medicamento(data:MedicamentoCreate,db:Session = Depends(get_db)):
    return servicio.saveMedicamento(db,data)

@router.put("/stock")
def update_stock(data:updateStock,db:Session = Depends(get_db)):
    return servicio.updateStock(db,data.id,data.cantidad)