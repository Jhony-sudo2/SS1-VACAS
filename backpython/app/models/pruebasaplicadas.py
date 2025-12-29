from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Date, Float, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Pruebasaplicadas(Base):
    __tablename__ = "pruebasaplicadas"

    fecha = Column(Date)
    resultado = Column(Float, nullable=False)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    sesion_id = Column(BigInteger, ForeignKey('sesiones.id'))
    interpretacion = Column(String(255))

    sesion = relationship('Sesiones')
