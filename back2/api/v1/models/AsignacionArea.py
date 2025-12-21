from sqlalchemy import Column, BigInteger, String,ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base
class AsignacionArea(Base):
    __tablename__ = "asignacionarea"

    empleadoId = Column("empleado_id", BigInteger, ForeignKey("empleados.id"), primary_key=True)
    areaId = Column("area_id", BigInteger, ForeignKey("areas.id"), primary_key=True)

    empleado = relationship("Empleado", back_populates="asignaciones_area")
    area = relationship("Area", back_populates="asignaciones_empleado")