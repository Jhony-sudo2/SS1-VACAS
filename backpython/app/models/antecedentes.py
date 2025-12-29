from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Antecedentes(Base):
    __tablename__ = "antecedentes"

    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    paciente_id = Column(BigInteger, ForeignKey('pacientes.id'))
    estructura = Column(String(255))
    eventos = Column(String(255))
    trastornos = Column(String(255))

    paciente = relationship('Pacientes')
