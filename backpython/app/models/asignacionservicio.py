from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger
from sqlalchemy.orm import relationship
from app.db.session import Base


class Asignacionservicio(Base):
    __tablename__ = "asignacionservicio"

    area_id = Column(BigInteger, ForeignKey('areas.id'), primary_key=True, nullable=False)
    servicio_id = Column(BigInteger, ForeignKey('servicios.id'), primary_key=True, nullable=False)

    area = relationship('Areas')
    servicio = relationship('Servicios')
