from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Integer
from sqlalchemy.orm import relationship
from app.db.session import Base


class Detalleventa(Base):
    __tablename__ = "detalleventa"

    cantidad = Column(Integer, nullable=False)
    factura_id = Column(BigInteger, ForeignKey('ventas.id'))
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    medicamento_id = Column(BigInteger, ForeignKey('medicamentos.id'))

    venta = relationship('Ventas')
    medicamento = relationship('Medicamentos')
