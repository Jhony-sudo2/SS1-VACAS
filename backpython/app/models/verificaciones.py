from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, String
from app.db.session import Base


class Verificaciones(Base):
    __tablename__ = "verificaciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    codigo = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
