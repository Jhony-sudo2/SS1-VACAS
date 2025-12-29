from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Areas(Base):
    __tablename__ = "areas"

    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    descripcion = Column(String(255))
    imagen = Column(String(255))
    nombre = Column(String(255))

    empleado_asignaciones = relationship('Asignacionarea')
    servicio_asignaciones = relationship('Asignacionservicio')
