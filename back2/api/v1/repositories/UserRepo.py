from sqlalchemy.orm import Session
from api.v1.models.User import Usuario

class UserRepository:
    def find_by_email(self, db: Session, email: str) -> Usuario | None:
        return db.query(Usuario).filter(Usuario.email == email).first()

    def find_by_codigo(self, db: Session, codigo: str) -> Usuario | None:
        return db.query(Usuario).filter(Usuario.codigoVerificacion == codigo).first()

    def find_by_id(self, db: Session, id_: int) -> Usuario | None:
        return db.query(Usuario).filter(Usuario.id == id_).first()

    def save(self, db: Session, usuario: Usuario) -> Usuario:
        db.add(usuario)
        db.commit()
        db.refresh(usuario)
        return usuario