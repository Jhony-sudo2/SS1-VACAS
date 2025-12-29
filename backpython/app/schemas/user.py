from __future__ import annotations
from pydantic import BaseModel, EmailStr
from datetime import date
from app.schemas.auth import Rol, rol_from_ordinal, rol_to_ordinal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class UsuarioBase(BaseModel):
    email: EmailStr
    rol: Rol | int

class UsuarioCreate(UsuarioBase):
    password: str
    a2f: bool = False
    estado: bool = True
    email_verificado: bool = False



class UsuarioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    email: str
    a2f: bool
    emailVerificado: bool = Field(..., alias="email_verificado")
    estado: bool
    rol: str | int
    codigoVerificacion: Optional[str] = Field(None, alias="codigo_verificacion")
    codigoVerificacionExpira: Optional[date] = Field(None, alias="codigo_verificacion_expira")
    password: str  

class EmpleadoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    nombre: str
    fechaNacimiento: Optional[date] = Field(None, alias="fecha_nacimiento")  
    aplicaIgss: bool = Field(..., alias="aplica_igss")
    estadoCivil: bool = Field(..., alias="estado_civil")
    genero: bool
    sueldo: float | int
    colegiado: Optional[str] = None
    telefono: Optional[str] = None
    bono: float | int
    usuario: UsuarioOut
class PacienteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    nombre: Optional[str] = None

    fechaNacimiento: Optional[date] = Field(None, alias="fecha_nacimiento")
    genero: bool
    estadoCivil: bool = Field(..., alias="estado_civil")

    direccion: Optional[str] = None
    nivelEducativo: Optional[str] = Field(None, alias="nivel_educativo")
    personaEmergencia: Optional[str] = Field(None, alias="persona_emergencia")
    procedencia: Optional[str] = None
    telefono: Optional[str] = None
    telefonoEmergencia: Optional[str] = Field(None, alias="telefono_emergencia")
    usuario: UsuarioOut

class PacienteDTO(BaseModel):
    nombre: str
    fechaNacimiento: date | None = None
    genero: bool
    estadoCivil: bool
    telefono: str | None = None
    direccion: str | None = None

class EmpleadoDTO(BaseModel):
    nombre: str
    fechaNacimiento: date | None = None
    genero: bool
    estadoCivil: bool
    telefono: str | None = None
    colegiado: str | None = None



