from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Estadosiniciales(Base):
    __tablename__ = "estadosiniciales"

    animmo = Column(Integer)
    ansiedad = Column(Integer)
    apetito = Column(Integer)
    funcionamientosocial = Column(Integer)
    suenio = Column(Integer)
    historia_id = Column(BigInteger, ForeignKey('historias.id'))
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    observaciones = Column(String(255))

    historia = relationship('Historias')
