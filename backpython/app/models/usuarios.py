from __future__ import annotations
from sqlalchemy import Column, ForeignKey
from sqlalchemy import BigInteger, Boolean, DateTime, Integer, String
from app.db.session import Base
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.types import TypeDecorator
from sqlalchemy.dialects.mysql import BIT

class BitBool(TypeDecorator):
    impl = BIT(1)
    cache_ok = True

    def process_result_value(self, value, dialect):
        if value is None:
            return False
        if isinstance(value, memoryview):
            value = value.tobytes()
        if isinstance(value, (bytes, bytearray)):
            return value != b"\x00"
        return bool(value)

    def process_bind_param(self, value, dialect):
        # al guardar
        return b"\x01" if value else b"\x00"

class Usuarios(Base):
    __tablename__ = "usuarios"

    a2f = Column(BitBool(), nullable=False)
    email_verificado = Column(BitBool(), nullable=False)
    estado = Column(BitBool(), nullable=False)
    rol = Column(Integer, nullable=False)
    codigo_verificacion_expira = Column(DateTime)
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    codigo_verificacion = Column(String(255))
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
