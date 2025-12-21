from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Enum as SAEnum
from db.base import Base
from enum import IntEnum
from db.types import IntEnumType
from sqlalchemy.orm import relationship
from db.types import BitBool

class Rol(IntEnum):
    ADMIN = 0
    PACIENTE = 1
    EMPLEADO = 2

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)

    password = Column(String(255), nullable=False)

    rol = Column(IntEnumType(Rol), nullable=False)

    email = Column(String(255), nullable=False, unique=True, index=True)

    a2f = Column("a2f", BitBool(), nullable=False)
    emailVerificado = Column("email_verificado", Boolean, nullable=False, default=False)
    codigoVerificacion = Column("codigo_verificacion", String(255), nullable=True)
    codigoVerificacionExpira = Column("codigo_verificacion_expira", DateTime, nullable=True)
    estado = Column(BitBool(), nullable=False, default=True)
    empleados = relationship("Empleado", back_populates="usuario")
    pacientes = relationship("Paciente", back_populates="usuario")

