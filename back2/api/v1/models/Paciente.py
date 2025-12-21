from sqlalchemy import Column, BigInteger, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class Paciente(Base):
    __tablename__ = "Pacientes"  # respeta el nombre exacto en MySQL

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)

    nombre = Column(String(255), nullable=True)

    genero = Column(Boolean, nullable=False, default=False)
    estadoCivil = Column("estado_civil", Boolean, nullable=False, default=False)

    direccion = Column(String(255), nullable=True)
    nivelEducativo = Column("nivel_educativo", String(100), nullable=True)

    telefono = Column(String(50), nullable=True)

    personaEmergencia = Column("persona_emergencia", String(255), nullable=True)
    telefonoEmergencia = Column("telefono_emergencia", String(50), nullable=True)

    procedencia = Column(String(150), nullable=True)

    usuarioId = Column("usuario_id", BigInteger, ForeignKey("usuarios.id"), nullable=False)

    usuario = relationship("Usuario", back_populates="pacientes")
