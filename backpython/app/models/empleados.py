from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Boolean, Date, Float, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Empleados(Base):
    __tablename__ = "empleados"

    aplica_igss = Column(Boolean, nullable=False)
    bono = Column(Float, nullable=False)
    estado_civil = Column(Boolean, nullable=False)
    fecha_nacimiento = Column(Date)
    genero = Column(Boolean, nullable=False)
    sueldo = Column(Float, nullable=False)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    usuario_id = Column(BigInteger, ForeignKey('usuarios.id'))
    colegiado = Column(String(255))
    nombre = Column(String(255))
    telefono = Column(String(255))

    usuario = relationship('Usuarios')
