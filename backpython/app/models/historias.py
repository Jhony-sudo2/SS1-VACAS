from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Date, Float, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Historias(Base):
    __tablename__ = "historias"

    costo_sesion = Column(Float, nullable=False)
    duracion = Column(Integer, nullable=False)
    enfoque = Column(Integer)
    estado = Column(Integer)
    fecha_apertura = Column(Date)
    frecuencia = Column(Integer)
    modalidad = Column(Integer)
    sesiones = Column(Integer, nullable=False)
    empleado_id = Column(BigInteger, ForeignKey('empleados.id'))
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    paciente_id = Column(BigInteger, ForeignKey('pacientes.id'))
    motivo_alta = Column(String(255))
    motivo_consulta = Column(String(255))
    procedencia = Column(String(255))

    empleado = relationship('Empleados')
    paciente = relationship('Pacientes')
