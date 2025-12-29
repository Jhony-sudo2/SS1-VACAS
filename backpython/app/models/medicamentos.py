from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Boolean, Float, Integer, String
from app.db.session import Base


class Medicamentos(Base):
    __tablename__ = "medicamentos"

    minimo = Column(Integer, nullable=False)
    precio = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False)
    tipo = Column(Boolean, nullable=False)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    imagen = Column(String(255))
    nombre = Column(String(255), nullable=False)
