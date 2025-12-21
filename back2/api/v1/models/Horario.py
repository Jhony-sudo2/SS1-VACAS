from sqlalchemy import Column, BigInteger, Integer, ForeignKey, Time
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import TINYINT
from db.base import Base
from db.types import BitBool

class Horario(Base):
    __tablename__ = "horarios"

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)

    dia = Column(Integer, nullable=False)

    horaEntrada = Column("hora_entrada", Time, nullable=False)
    horaSalida = Column("hora_salida", Time, nullable=False)

    # Si tu DB usa BIT(1) para boolean (como te pasó con a2f):
    trabaja = Column("trabaja", BitBool(), nullable=False)

    # Si tu DB usa TINYINT(1) en vez de BIT(1), usa esto en lugar de la línea anterior:
    # trabaja = Column("trabaja", TINYINT(1), nullable=False, default=0)

    empleadoId = Column("empleado_id", BigInteger, ForeignKey("empleados.id"), nullable=False)

    empleado = relationship("Empleado", back_populates="horarios")
    descansos = relationship("Descanso", back_populates="horario", cascade="all, delete-orphan")

class Descanso(Base):
    __tablename__ = "descansos"

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)

    horarioId = Column("horario_id", BigInteger, ForeignKey("horarios.id"), nullable=False)

    inicio = Column(Time, nullable=False)
    fin = Column(Time, nullable=False)

    horario = relationship("Horario", back_populates="descansos")

