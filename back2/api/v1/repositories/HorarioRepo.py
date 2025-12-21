from sqlalchemy.orm import Session
from api.v1.models.Horario import Horario,Descanso

class HorarioRepo:
    def find_by_empleado_id_and_dia(self, db: Session, empleado_id: int, dia: int) -> Horario | None:
        return (
            db.query(Horario)
            .filter(Horario.empleadoId == empleado_id, Horario.dia == dia)
            .first()
        )

    def find_all_by_empleado_id(self, db: Session, empleado_id: int) -> list[Horario]:
        return db.query(Horario).filter(Horario.empleadoId == empleado_id).all()

    def save(self, db: Session, obj: Horario) -> Horario:
        db.add(obj)
        db.flush()      
        db.refresh(obj)
        return obj
    
class DescansoRepo:
    def find_all_by_horario_id(self, db: Session, horario_id: int) -> list[Descanso]:
        return db.query(Descanso).filter(Descanso.horarioId == horario_id).all()

    def delete_all_by_horario_id(self, db: Session, horario_id: int):
        db.query(Descanso).filter(Descanso.horarioId == horario_id).delete(synchronize_session=False)

    def save(self, db: Session, obj: Descanso) -> Descanso:
        db.add(obj)
        db.flush()
        db.refresh(obj)
        return obj