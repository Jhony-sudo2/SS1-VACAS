from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from pydantic import ConfigDict, Field, field_serializer

from app.schemas.common import CamelModel
from app.schemas.enums_map import (
    ROL, ESTADO_CITA, ESTADO_HISTORIA, ENFOQUE, FRECUENCIA, MODALIDAD,
    CONSUMO, ESTADO_EMOCION,
)
from app.schemas import generated as g


# -----------------------------
# Core nested objects (like Spring JSON)
# -----------------------------

class UsuarioOut(g.UsuariosSchema):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_serializer("rol")
    def _rol(self, v, _info):
        return ROL.get(v, v)


class EmpleadoOut(g.EmpleadosSchema):
    usuario: Optional[UsuarioOut] = None
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class PacienteOut(g.PacientesSchema):
    usuario: Optional[UsuarioOut] = None
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class HistoriaOut(CamelModel):
    id: int
    costo_sesion: float = Field(..., alias="costoSesion")
    duracion: int
    enfoque: Optional[int] = None
    estado: Optional[int] = None
    fecha_apertura: Optional[date] = Field(None, alias="fechaApertura")
    frecuencia: Optional[int] = None
    modalidad: Optional[int] = None
    sesiones: int
    motivo_alta: Optional[str] = Field(None, alias="motivoAlta")
    motivo_consulta: Optional[str] = Field(None, alias="motivoConsulta")
    procedencia: Optional[str] = None

    empleado: Optional[EmpleadoOut] = None
    paciente: Optional[PacienteOut] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_serializer("estado")
    def _estado(self, v, _info):
        return ESTADO_HISTORIA.get(v, v)

    @field_serializer("enfoque")
    def _enfoque(self, v, _info):
        return ENFOQUE.get(v, v)

    @field_serializer("frecuencia")
    def _frecuencia(self, v, _info):
        return FRECUENCIA.get(v, v)

    @field_serializer("modalidad")
    def _modalidad(self, v, _info):
        return MODALIDAD.get(v, v)


class CitaOut(CamelModel):
    id: int
    estado: Optional[int] = None
    fecha: Optional[datetime] = None
    nombre_paciente: Optional[str] = Field(None, alias="nombrePaciente")
    empleado: Optional[EmpleadoOut] = None
    paciente: Optional[PacienteOut] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_serializer("estado")
    def _estado(self, v, _info):
        return ESTADO_CITA.get(v, v)


class SesionOut(g.SesionesSchema):
    historia: Optional[HistoriaOut] = None
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ImpresionDiagnosticaOut(g.ImpresiondiagnosticaSchema):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class PruebaAplicadaOut(g.PruebasaplicadasSchema):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class SesionDetailOut(CamelModel):
    sesion: SesionOut
    pruebas_aplicadas: List[PruebaAplicadaOut] = Field(default_factory=list, alias="pruebasAplicadas")
    impresion_diagnostica: Optional[ImpresionDiagnosticaOut] = Field(None, alias="impresionDiagnostica")
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class MedicamentoOut(g.MedicamentosSchema):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class DetalleVentaOut(g.DetalleventaSchema):
    medicamento: Optional[MedicamentoOut] = None
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class VentaOut(g.VentasSchema):
    paciente: Optional[PacienteOut] = None
    detalle: List[DetalleVentaOut] = []
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class PagoSesionOut(g.PagosesionSchema):
    cita: Optional[CitaOut] = None
    sesion: Optional[SesionOut] = None
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# Additional OUT for history-personal & estado-inicial with enums
class HistoriaPersonalOut(g.HistoriaspersonalesSchema):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_serializer("alcohol")
    def _alcohol(self, v, _info):
        return CONSUMO.get(v, v)

    @field_serializer("tabaco")
    def _tabaco(self, v, _info):
        return CONSUMO.get(v, v)

    @field_serializer("drogas")
    def _drogas(self, v, _info):
        return CONSUMO.get(v, v)


class EstadoInicialOut(g.EstadosinicialesSchema):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_serializer("animmo")
    def _animo(self, v, _info):
        return ESTADO_EMOCION.get(v, v)

    @field_serializer("ansiedad")
    def _ansiedad(self, v, _info):
        return ESTADO_EMOCION.get(v, v)

    @field_serializer("apetito")
    def _apetito(self, v, _info):
        return ESTADO_EMOCION.get(v, v)

    @field_serializer("funcionamientosocial")
    def _func_soc(self, v, _info):
        return ESTADO_EMOCION.get(v, v)

    @field_serializer("suenio")
    def _suenio(self, v, _info):
        return ESTADO_EMOCION.get(v, v)
