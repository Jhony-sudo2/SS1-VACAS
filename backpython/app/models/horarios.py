from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Boolean, Integer, Time
from sqlalchemy.orm import relationship
from app.db.session import Base


class Horarios(Base):
    __tablename__ = "horarios"

    dia = Column(Integer, nullable=False)
    hora_entrada = Column(Time, nullable=False)
    hora_salida = Column(Time, nullable=False)
    trabaja = Column(Boolean, nullable=False)
    empleado_id = Column(BigInteger, ForeignKey('empleados.id'))
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)

    empleado = relationship('Empleados')
    descansos = relationship('Descansos', back_populates='horario', cascade='all, delete-orphan')
