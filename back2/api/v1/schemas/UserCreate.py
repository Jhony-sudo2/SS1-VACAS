from pydantic import BaseModel, EmailStr,ConfigDict
from datetime import date
from api.v1.models.User import Rol
from datetime import datetime

class UsuarioOut(BaseModel):
    id: int
    email: EmailStr
    rol: Rol
    a2f: bool
    codigoVerificacion: str | None = None
    codigoVerificacionExpira: datetime | None = None
    emailVerificado: bool
    estado: bool

    model_config = ConfigDict(from_attributes=True)

class UsuarioCreate2(BaseModel):
    email: EmailStr
    password: str
    rol: Rol
    a2f: bool = False
    estado: bool = True

class EmpleadoOut(BaseModel):
    id: int
    nombre: str | None = None
    fechaNacimiento: date | None = None
    genero: bool = False
    estadoCivil: bool = False
    telefono: str | None = None
    colegiado: str | None = None
    usuario:UsuarioOut

class EmpleadoCreate(BaseModel):
    nombre: str | None = None
    fechaNacimiento: date | None = None
    genero: bool = False
    estadoCivil: bool = False
    telefono: str | None = None
    colegiado: str | None = None

class PacienteCreate(BaseModel):
    nombre: str | None = None
    genero: bool = False
    estadoCivil: bool = False
    direccion: str | None = None
    nivelEducativo: str | None = None
    telefono: str | None = None
    personaEmergencia: str | None = None
    telefonoEmergencia: str | None = None
    procedencia: str | None = None



class UserCreate(BaseModel):
    usuario: UsuarioCreate2 | None = None
    empleado: EmpleadoCreate | None = None
    paciente: PacienteCreate | None = None
    model_config = ConfigDict(from_attributes=True)  # Pydantic v2


class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True  
