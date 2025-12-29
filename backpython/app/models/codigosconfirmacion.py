from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, DateTime, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Codigosconfirmacion(Base):
    __tablename__ = "codigosconfirmacion"

    tipo = Column(Integer, nullable=False)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    vencimiento = Column(DateTime, nullable=False)
    codigo = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
