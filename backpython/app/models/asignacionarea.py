from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger
from sqlalchemy.orm import relationship
from app.db.session import Base


class Asignacionarea(Base):
    __tablename__ = "asignacionarea"

    area_id = Column(BigInteger, ForeignKey('areas.id'), primary_key=True, nullable=False)
    empleado_id = Column(BigInteger, ForeignKey('empleados.id'), primary_key=True, nullable=False)

    area = relationship('Areas')
    empleado = relationship('Empleados')
