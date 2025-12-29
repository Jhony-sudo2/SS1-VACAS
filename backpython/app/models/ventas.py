from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Boolean, Date, Float, LargeBinary, String
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.db.types import BitBool  # donde lo tengas


class Ventas(Base):
    __tablename__ = "ventas"

    estado_entrega = Column(BitBool(), nullable=False)    
    fecha = Column(Date)
    total = Column(Float, nullable=False)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    paciente_id = Column(BigInteger, ForeignKey('pacientes.id'))
    codigo = Column(String(255))
    tarjeta = Column(String(255))
    fecha_vencimiento = Column(LargeBinary(255))

    paciente = relationship('Pacientes')
    detalle = relationship('Detalleventa', cascade='all, delete-orphan')
