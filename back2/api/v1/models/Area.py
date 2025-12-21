from sqlalchemy import Column, BigInteger, String,ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class Area(Base):
    __tablename__ = "areas"
    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    nombre = Column(String(255), nullable=False, index=True)
    asignaciones_empleado = relationship("AsignacionArea", back_populates="area")



