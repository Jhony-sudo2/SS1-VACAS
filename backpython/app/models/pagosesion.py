from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Date, Float, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Pagosesion(Base):
    __tablename__ = "pagosesion"

    fecha = Column(Date, nullable=False)
    total = Column(Float, nullable=False)
    cita_id = Column(BigInteger, ForeignKey('citas.id'))
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    sesion_id = Column(BigInteger, ForeignKey('sesiones.id'))
    codigo = Column(String(255))
    fecha_vencimiento = Column(String(255))
    tarjeta = Column(String(255))

    cita = relationship('Citas')
    sesion = relationship('Sesiones')
