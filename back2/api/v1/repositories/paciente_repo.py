from sqlalchemy.orm import Session
from api.v1.models.Paciente import Paciente

class PacienteRepo:
    def find_by_id(self, db: Session, id_: int) -> Paciente | None:
        return db.query(Paciente).filter(Paciente.id == id_).first()

    def save(self, db: Session, paciente: Paciente) -> Paciente:
        db.add(paciente)
        db.commit()
        db.refresh(paciente)
        return paciente
