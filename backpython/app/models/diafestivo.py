from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Integer
from app.db.session import Base


class Diafestivo(Base):
    __tablename__ = "diafestivo"

    dia = Column(Integer)
    mes = Column(Integer)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
