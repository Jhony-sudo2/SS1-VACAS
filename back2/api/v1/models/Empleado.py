from sqlalchemy import Column, BigInteger, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class Empleado(Base):
    __tablename__ = "empleados"  # si tu tabla es exactamente así en MySQL
    
    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)

    nombre = Column(String(255), nullable=True)

    # camelCase en Python -> snake_case en BD
    fechaNacimiento = Column("fecha_nacimiento", Date, nullable=True)

    genero = Column(Boolean, nullable=False, default=False)
    estadoCivil = Column("estado_civil", Boolean, nullable=False, default=False)

    telefono = Column(String(50), nullable=True)
    colegiado = Column(String(50), nullable=True)
 
    usuarioId = Column("usuario_id", BigInteger, ForeignKey("usuarios.id"), nullable=False)
    usuario = relationship("Usuario", back_populates="empleados")
    asignaciones_area = relationship("AsignacionArea", back_populates="empleado")
    horarios = relationship("Horario", back_populates="empleado", cascade="all, delete-orphan")
