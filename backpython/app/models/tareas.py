from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Boolean, String
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.usuarios import BitBool

class Tareas(Base):
    __tablename__ = "tareas"

    estado = Column(BitBool(), nullable=False)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    paciente_id = Column(BigInteger, ForeignKey('pacientes.id'))
    instrucciones = Column(String(255))

    paciente = relationship('Pacientes')
