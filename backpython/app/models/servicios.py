from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Servicios(Base):
    __tablename__ = "servicios"

    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    descripcion = Column(String(255))
    imagen = Column(String(255))
    nombre = Column(String(255))

    area_asignaciones = relationship('Asignacionservicio')
