from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Historiaspersonales(Base):
    __tablename__ = "historiaspersonales"

    alcohol = Column(Integer)
    drogas = Column(Integer)
    tabaco = Column(Integer)
    historia_id = Column(BigInteger, ForeignKey('historias.id'))
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    desarrollo = Column(String(255))
    historia_academica = Column(String(255))
    historia_medica = Column(String(255))
    hospitalizaciones = Column(String(255))
    medicacion_actual = Column(String(255))
    tratamientos_previos = Column(String(255))

    historia = relationship('Historias')
