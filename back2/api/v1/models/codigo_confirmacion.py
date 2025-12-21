from sqlalchemy import Column, BigInteger, String, DateTime
from db.base import Base

class CodigoConfirmacion(Base):
    __tablename__ = "codigosconfirmacion"
    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    codigo = Column(String(255), nullable=False, unique=True, index=True)
    vencimiento = Column("codigo_verificacion_expira", DateTime, nullable=True)

