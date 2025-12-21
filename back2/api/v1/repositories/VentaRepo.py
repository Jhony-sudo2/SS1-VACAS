from api.v1.schemas.Venta import MedicamentoCreate
from api.v1.models.Medicamento import Medicamento
from sqlalchemy.orm import Session

class MedicamentoRepo:
    def __init__(self):
        pass

    def save(self,db:Session,data:MedicamentoCreate):
        obj = Medicamento()
        obj.imagen = data.imagen
        obj.minimo = data.minimo
        obj.nombre = data.nombre
        obj.precio = data.precio
        obj.stock = data.stock
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj
    
    def fin_all(self,db:Session):
        return db.query(Medicamento).all()
    
    def find_by_id(self,db:Session,id:int):
        return db.query(Medicamento).filter(Medicamento.id == id).first()

    
    def update(self, db: Session, obj: Medicamento) -> Medicamento:
        db.add(obj)        # asegura que esté en sesión
        db.commit()
        db.refresh(obj)
        return obj