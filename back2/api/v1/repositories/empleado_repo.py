from sqlalchemy.orm import Session
from api.v1.models.Empleado import Empleado
from api.v1.models.Area import Area
from api.v1.models.AsignacionArea import AsignacionArea

from fastapi import HTTPException, status

class EmpleadoRepo:
    def find_by_id(self, db: Session, id_: int) -> Empleado | None:
        empleado = db.query(Empleado).filter(Empleado.id == id_).first()
        if not empleado:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Empleado no encontrado")
        return empleado

    def save(self, db: Session, empleado: Empleado) -> Empleado:
        db.add(empleado)
        db.commit()
        db.refresh(empleado)
        return empleado
    
    def find_all(self,db:Session)->list[Empleado] | None:
        return db.query(Empleado).all()
    
    def get_areas_by_empleado(self,db: Session, id: int):
        return (
            db.query(Area)
            .join(AsignacionArea, AsignacionArea.areaId == Area.id)
            .filter(AsignacionArea.empleadoId == id)
            .all()
        )
    