from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Impresiondiagnostica(Base):
    __tablename__ = "impresiondiagnostica"

    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    sesion_id = Column(BigInteger, ForeignKey('sesiones.id'))
    descripcion = Column(String(255))
    factores_mantenedores = Column(String(255))
    factores_precipitantes = Column(String(255))
    factores_predisponentes = Column(String(255))
    nivel_funcionamiento = Column(String(255))

    sesion = relationship('Sesiones')
