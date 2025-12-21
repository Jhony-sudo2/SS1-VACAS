from pydantic import BaseModel, ConfigDict
from datetime import time, date, datetime
from typing import Any

class UsuarioLite(BaseModel):
    id: int | None = None
    email: str | None = None
    rol: int | None = None
    a2f: bool | None = None
    model_config = ConfigDict(extra="ignore")

class EmpleadoLite(BaseModel):
    id: int | None = None
    nombre: str | None = None
    fechaNacimiento: date | None = None
    genero: bool | None = None
    estadoCivil: bool | None = None
    telefono: str | None = None
    colegiado: str | None = None
    usuario: UsuarioLite | None = None
    model_config = ConfigDict(extra="ignore")

class HorarioIn(BaseModel):
    dia: int
    horaEntrada: time
    trabaja:bool = True
    horaSalida: time
    empleado: EmpleadoLite | None = None
    model_config = ConfigDict(extra="ignore")

class DescansoIn(BaseModel):
    inicio: time
    fin: time
    model_config = ConfigDict(extra="ignore")

class AsignarHorario(BaseModel):
    empleadoId: int
    horario: HorarioIn
    descansos: list[DescansoIn] = []
    model_config = ConfigDict(extra="ignore")
