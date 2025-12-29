from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Float, Integer, String
from app.db.session import Base


class Empresa(Base):
    __tablename__ = "empresa"

    precio_cita = Column(Float, nullable=False)
    tiempo_cita = Column(Integer, nullable=False)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    imagen = Column(String(255))
    nombre = Column(String(255))
