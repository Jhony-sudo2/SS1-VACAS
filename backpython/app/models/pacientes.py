from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Boolean, Date, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Pacientes(Base):
    __tablename__ = "pacientes"

    estado_civil = Column(Boolean, nullable=False)
    fecha_nacimiento = Column(Date)
    genero = Column(Boolean, nullable=False)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    usuario_id = Column(BigInteger, ForeignKey('usuarios.id'))
    direccion = Column(String(255))
    nivel_educativo = Column(String(255))
    nombre = Column(String(255))
    persona_emergencia = Column(String(255))
    procedencia = Column(String(255))
    telefono = Column(String(255))
    telefono_emergencia = Column(String(255))

    usuario = relationship('Usuarios')
