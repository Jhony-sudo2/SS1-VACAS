from sqlalchemy.orm import Session
from api.v1.models.codigo_confirmacion import CodigoConfirmacion

class CodigoConfirmacionRepo:
    def find_by_email(self, db: Session, email: str) -> CodigoConfirmacion | None:
        return db.query(CodigoConfirmacion).filter(CodigoConfirmacion.email == email).first()

    def delete(self, db: Session, obj: CodigoConfirmacion):
        db.delete(obj)
        db.commit()

    def save(self, db: Session, obj: CodigoConfirmacion):
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj
