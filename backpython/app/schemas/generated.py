from __future__ import annotations
from datetime import time

from typing import Optional, Union
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict
from pydantic import Field
from app.schemas.user import PacienteOut
def to_camel(s: str) -> str:
    parts = s.split('_')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

class AntecedentesSchema(CamelModel):
    id: Optional[int] = None
    paciente_id: Optional[int] = None
    estructura: Optional[str] = None
    eventos: Optional[str] = None
    trastornos: Optional[str] = None

class AreasSchema(CamelModel):
    id: Optional[int] = None
    descripcion: Optional[str] = None
    imagen: Optional[str] = None
    nombre: Optional[str] = None

class AsignacionareaSchema(CamelModel):
    area_id: Optional[int] = None
    empleado_id: Optional[int] = None

class AsignacionservicioSchema(CamelModel):
    area_id: Optional[int] = None
    servicio_id: Optional[int] = None

class CitasSchema(CamelModel):
    estado: Optional[int] = None
    empleado_id: Optional[int] = None
    fecha: Optional[datetime] = None
    id: Optional[int] = None
    paciente_id: Optional[int] = None

class CodigosconfirmacionSchema(CamelModel):
    tipo: Optional[int] = None
    id: Optional[int] = None
    vencimiento: Optional[datetime] = None
    codigo: Optional[str] = None
    email: Optional[str] = None

class DescansosSchema(CamelModel):
    fin: Optional[time] = None
    inicio: Optional[time] = None
    horario_id: Optional[int] = None
    id: Optional[int] = None

class DetalleventaSchema(CamelModel):
    cantidad: Optional[int] = None
    factura_id: Optional[int] = None
    id: Optional[int] = None
    medicamento_id: Optional[int] = None

class DiafestivoSchema(CamelModel):
    dia: Optional[int] = None
    mes: Optional[int] = None
    id: Optional[int] = None

class EmpleadosSchema(CamelModel):
    aplica_igss: Optional[bool] = None
    bono: Optional[float] = None
    estado_civil: Optional[bool] = None
    fecha_nacimiento: Optional[date] = None
    genero: Optional[bool] = None
    sueldo: Optional[float] = None
    id: Optional[int] = None
    usuario_id: Optional[int] = None
    colegiado: Optional[str] = None
    nombre: Optional[str] = None
    telefono: Optional[str] = None

class EmpresaSchema(CamelModel):
    id: Optional[int] = None
    nombre: Optional[str] = None
    imagen: Optional[str] = None
    precio_cita: Optional[float] = Field(None, alias="precioCita")
    tiempo_cita: Optional[int] = Field(None, alias="tiempoCita")

class EstadosinicialesSchema(CamelModel):
    animmo: Optional[int] = None
    ansiedad: Optional[int] = None
    apetito: Optional[int] = None
    funcionamientosocial: Optional[int] = None
    suenio: Optional[int] = None
    historia_id: Optional[int] = None
    id: Optional[int] = None
    observaciones: Optional[str] = None

class HistoriasSchema(CamelModel):
    costo_sesion: Optional[float] = None
    duracion: Optional[int] = None
    enfoque: Optional[int] = None
    estado: Optional[int] = None
    fecha_apertura: Optional[date] = None
    frecuencia: Optional[int] = None
    modalidad: Optional[int] = None
    sesiones: Optional[int] = None
    empleado_id: Optional[int] = None
    id: Optional[int] = None
    paciente_id: Optional[int] = None
    motivo_alta: Optional[str] = None
    motivo_consulta: Optional[str] = None
    procedencia: Optional[str] = None

class HistoriaspersonalesSchema(CamelModel):
    alcohol: Optional[int] = None
    drogas: Optional[int] = None
    tabaco: Optional[int] = None
    historia_id: Optional[int] = None
    id: Optional[int] = None
    desarrollo: Optional[str] = None
    historia_academica: Optional[str] = None
    historia_medica: Optional[str] = None
    hospitalizaciones: Optional[str] = None
    medicacion_actual: Optional[str] = None
    tratamientos_previos: Optional[str] = None

class HorariosSchema(CamelModel):
    dia: Optional[int] = None
    hora_entrada: Optional[time] = None
    hora_salida: Optional[time] = None
    trabaja: Optional[bool] = None
    empleado_id: Optional[int] = None
    id: Optional[int] = None

class ImpresiondiagnosticaSchema(CamelModel):
    id: Optional[int] = None
    sesion_id: Optional[int] = None
    descripcion: Optional[str] = None
    factores_mantenedores: Optional[str] = None
    factores_precipitantes: Optional[str] = None
    factores_predisponentes: Optional[str] = None
    nivel_funcionamiento: Optional[str] = None

class MedicamentosSchema(CamelModel):
    minimo: Optional[int] = None
    precio: Optional[float] = None
    stock: Optional[int] = None
    tipo: Optional[bool] = None
    id: Optional[int] = None
    imagen: Optional[str] = None
    nombre: Optional[str] = None

class PacientesSchema(CamelModel):
    estado_civil: Optional[bool] = None
    fecha_nacimiento: Optional[date] = None
    genero: Optional[bool] = None
    id: Optional[int] = None
    usuario_id: Optional[int] = None
    direccion: Optional[str] = None
    nivel_educativo: Optional[str] = None
    nombre: Optional[str] = None
    persona_emergencia: Optional[str] = None
    procedencia: Optional[str] = None
    telefono: Optional[str] = None
    telefono_emergencia: Optional[str] = None

class PagosesionSchema(CamelModel):
    fecha: Optional[date] = None
    total: Optional[float] = None
    cita_id: Optional[int] = None
    id: Optional[int] = None
    sesion_id: Optional[int] = None
    codigo: Optional[str] = None
    fecha_vencimiento: Optional[str] = None
    tarjeta: Optional[str] = None

class PruebasaplicadasSchema(CamelModel):
    fecha: Optional[date] = None
    resultado: Optional[float] = None
    id: Optional[int] = None
    sesion_id: Optional[int] = None
    interpretacion: Optional[str] = None

class RecetasSchema(CamelModel):
    cantidad: Optional[int] = None
    id: Optional[int] = None
    medicamento_id: Optional[int] = None
    paciente_id: Optional[int] = None
    sesion: Optional[int] = None
    indicaciones: Optional[str] = None

class RecetaIn(CamelModel):
    id: Optional[int] = None
    cantidad: Optional[int] = None
    indicaciones: Optional[str] = None

    medicamento: Optional[dict] = None
    paciente: Optional[dict] = None

    sesion: Optional[Union[int, dict]] = None

    medicamento_id: Optional[int] = Field(default=None, alias="medicamentoId")
    paciente_id: Optional[int] = Field(default=None, alias="pacienteId")
    sesion_id: Optional[int] = Field(default=None, alias="sesionId")

class ServiciosSchema(CamelModel):
    id: Optional[int] = None
    descripcion: Optional[str] = None
    imagen: Optional[str] = None
    nombre: Optional[str] = None

class SesionesSchema(CamelModel):
    estado: Optional[int] = None
    estado_pago: Optional[bool] = None
    numero: Optional[int] = None
    fecha: Optional[datetime] = None
    historia_id: Optional[int] = None
    id: Optional[int] = None
    justificacion: Optional[str] = None
    observaciones: Optional[str] = None
    respuestas: Optional[str] = None
    temas: Optional[str] = None
class SesionIn(CamelModel):
    id: Optional[int] = None
    numero: Optional[int] = None
    fecha: Optional[datetime] = None
    estado: Optional[str] = None
    justificacion: Optional[str] = None
    temas: Optional[str] = None
    respuestas: Optional[str] = None
    observaciones: Optional[str] = None
    estado_pago: Optional[bool] = Field(default=None, alias="estadoPago")
    historia: Optional[dict] = None
    historia_id: Optional[int] = Field(default=None, alias="historiaId")

class TareasSchema(CamelModel):
    estado: Optional[bool] = None
    id: Optional[int] = None
    paciente_id: Optional[int] = None
    instrucciones: Optional[str] = None
    paciente: Optional[dict] = None

class TareaOut(CamelModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: Optional[int] = None
    instrucciones: Optional[str] = None
    estado: Optional[bool] = None
    paciente_id: Optional[int] = Field(default=None, alias="paciente_id")  # opcional
    paciente: Optional[PacienteOut] = None

class TareaIn(CamelModel):
    id: Optional[int] = None
    instrucciones: Optional[str] = None
    paciente_id: Optional[int] = Field(default=None, alias="pacienteId")
    paciente: Optional[dict] = None
class UsuariosSchema(CamelModel):
    a2f: Optional[bool] = None
    email_verificado: Optional[bool] = None
    estado: Optional[bool] = None
    rol: Optional[int] = None
    codigo_verificacion_expira: Optional[datetime] = None
    id: Optional[int] = None
    codigo_verificacion: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

class VentasSchema(CamelModel):
    estado_entrega: Optional[bool] = None
    fecha: Optional[date] = None
    total: Optional[float] = None
    id: Optional[int] = None
    paciente_id: Optional[int] = None
    codigo: Optional[str] = None
    tarjeta: Optional[str] = None
    fecha_vencimiento: Optional[bytes] = None

class VerificacionesSchema(CamelModel):
    id: Optional[int] = None
    codigo: Optional[str] = None
    email: Optional[str] = None

class MedicamentoOut(CamelModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    nombre: Optional[str] = None
    precio: Optional[float] = None
    minimo: Optional[int] = None
    stock: Optional[int] = None
    tipo: Optional[bool] = None
    imagen: Optional[str] = None


class RecetaOut(CamelModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    cantidad: Optional[int] = None
    indicaciones: Optional[str] = None
    sesion: Optional[int] = None

    medicamento: Optional[MedicamentoOut] = None
    paciente: Optional[PacienteOut] = None