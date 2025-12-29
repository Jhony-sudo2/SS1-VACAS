from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Recetas(Base):
    __tablename__ = "recetas"

    cantidad = Column(Integer, nullable=False)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    medicamento_id = Column(BigInteger, ForeignKey('medicamentos.id'))
    paciente_id = Column(BigInteger, ForeignKey('pacientes.id'))
    sesion = Column(BigInteger, nullable=False)
    indicaciones = Column(String(255), nullable=False)

    paciente = relationship('Pacientes')
    medicamento = relationship('Medicamentos')
