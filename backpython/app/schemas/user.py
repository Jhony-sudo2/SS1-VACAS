from __future__ import annotations
from pydantic import BaseModel, EmailStr
from datetime import date
from app.schemas.auth import Rol, rol_from_ordinal, rol_to_ordinal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, date

class UsuarioBase(BaseModel):
    email: EmailStr
    rol: Rol | int
    password: str
    a2f: bool = False
    estado: bool = True
    email_verificado: bool = False


class ConfirmarCorreoIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    codigo: str
    email: Optional[str] = None


class UsuarioIn(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    email: str
    password: str
    rol: str
    a2f: bool = False

    # campos que Swagger muestra pero vamos a IGNORAR al guardar
    id: Optional[int] = None
    codigoVerificacion: Optional[str] = Field(None, alias="codigo_verificacion")
    codigoVerificacionExpira: Optional[datetime] = Field(None, alias="codigo_verificacion_expira")
    emailVerificado: Optional[bool] = Field(None, alias="email_verificado")
    estado: Optional[bool] = None

class EmpleadoIn(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    nombre: str
    fechaNacimiento: Optional[date] = None
    genero: bool
    estadoCivil: bool
    telefono: Optional[str] = None
    colegiado: Optional[str] = None

    # si en tu BD existen (y son NOT NULL), incluilos aquí:
    sueldo: Optional[float] = None
    bono: Optional[float] = None
    aplicaIgss: Optional[bool] = None

class PacienteIn(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    nombre: str
    genero: bool
    estadoCivil: bool
    direccion: Optional[str] = None
    nivelEducativo: Optional[str] = None
    telefono: Optional[str] = None
    personaEmergencia: Optional[str] = None
    telefonoEmergencia: Optional[str] = None
    procedencia: Optional[str] = None
    fechaNacimiento: Optional[datetime] = None

class UsuarioCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    usuario: UsuarioIn
    empleado: Optional[EmpleadoIn] = None
    paciente: Optional[PacienteIn] = None


class UsuarioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    email: str
    a2f: bool
    emailVerificado: bool = Field(..., alias="email_verificado")
    estado: bool
    rol: str | int
    codigoVerificacion: Optional[str] = Field(None, alias="codigo_verificacion")
    codigoVerificacionExpira: Optional[datetime] = Field(None, alias="codigo_verificacion_expira")
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



