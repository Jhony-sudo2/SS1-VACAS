from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Time
from sqlalchemy.orm import relationship
from app.db.session import Base


class Descansos(Base):
    __tablename__ = "descansos"

    fin = Column(Time)
    inicio = Column(Time)
    horario_id = Column(BigInteger, ForeignKey('horarios.id'))
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)

    horario = relationship('Horarios', back_populates='descansos')
