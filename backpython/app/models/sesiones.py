from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Boolean, DateTime, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Sesiones(Base):
    __tablename__ = "sesiones"

    estado = Column(Integer)
    estado_pago = Column(Boolean, nullable=False)
    numero = Column(Integer, nullable=False)
    fecha = Column(DateTime)
    historia_id = Column(BigInteger, ForeignKey('historias.id'))
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    justificacion = Column(String(255))
    observaciones = Column(String(255))
    respuestas = Column(String(255))
    temas = Column(String(255))

    historia = relationship('Historias')
    pruebas_aplicadas = relationship('Pruebasaplicadas', cascade='all, delete-orphan')
    impresion_diagnostica = relationship('Impresiondiagnostica', uselist=False, cascade='all, delete-orphan')
