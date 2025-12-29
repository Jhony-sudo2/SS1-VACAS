from __future__ import annotations
from pydantic import BaseModel, EmailStr, Field
from enum import Enum
from datetime import datetime, date, time

class Rol(str, Enum):
    ADMIN="ADMIN"
    PACIENTE="PACIENTE"
    TRABAJADOR="TRABAJADOR"
    ADMINISTRATIVO="ADMINISTRATIVO"
    MANTENIMIENTO="MANTENIMIENTO"

ROL_ORDER = [r.value for r in Rol]

def rol_from_ordinal(v: int | None) -> Rol | None:
    if v is None: 
        return None
    if 0 <= v < len(ROL_ORDER):
        return Rol(ROL_ORDER[v])
    return None

def rol_to_ordinal(v: Rol | str | int | None) -> int | None:
    if v is None:
        return None
    if isinstance(v,int):
        return v
    val = v.value if isinstance(v,Rol) else str(v)
    return ROL_ORDER.index(val)

class Login(BaseModel):
    email: EmailStr
    password: str

class ConfirmarCorreoRequest(BaseModel):
    email: EmailStr
    codigo: str

class UserDto(BaseModel):
    id: int
    email: EmailStr
    rol: Rol

class AuthResponse(BaseModel):
    accessToken: str | None
    tokenType: str = "Bearer"
    expiresIn: int
    user: UserDto | None = None
    mensaje: str | None = None

class UpdateEstado(BaseModel):
    id: int  

class UpdatePass(BaseModel):
    email: EmailStr
    nueva: str

class UpdatePassword(BaseModel):
    usuarioId:int
    actual: str
    nueva: str

class RecuperarContrasenia(BaseModel):
    email: EmailStr

class ConfirmarCodigo(BaseModel):
    email: EmailStr
    codigo: str

