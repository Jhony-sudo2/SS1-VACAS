from sqlalchemy import Column, BigInteger, String, Double, Integer
from sqlalchemy.dialects.mysql import TINYINT
from db.base import Base
from db.types import BitBool  # úsalo solo si tu columna es BIT(1)

class Medicamento(Base):
    __tablename__ = "medicamentos"
    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    nombre = Column(String(255), nullable=False, index=True)
    precio = Column(Double, nullable=False)
    minimo = Column(Integer, nullable=False)
    stock = Column(Integer, nullable=False)
    tipo = Column("tipo", BitBool(), nullable=False)
    imagen = Column(String(500), nullable=True)
