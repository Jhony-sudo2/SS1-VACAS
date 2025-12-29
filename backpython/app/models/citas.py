from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, DateTime, Integer
from sqlalchemy.orm import relationship
from app.db.session import Base


class Citas(Base):
    __tablename__ = "citas"

    estado = Column(Integer)
    empleado_id = Column(BigInteger, ForeignKey('empleados.id'))
    fecha = Column(DateTime)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    paciente_id = Column(BigInteger, ForeignKey('pacientes.id'))

    empleado = relationship('Empleados')
    paciente = relationship('Pacientes')
