from __future__ import annotations

from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.ventas import Ventas
from app.models.pagosesion import Pagosesion
from app.models.detalleventa import Detalleventa
from app.models.medicamentos import Medicamentos
from app.models.empleados import Empleados
from app.schemas.common import CamelModel
from app.schemas.generated import MedicamentosSchema, VentasSchema


router = APIRouter(prefix="/reportes", tags=["reportes"])


class ReporteFinancieroDTO(CamelModel):
    ingresos_ventas: float = Field(..., alias="ingresosVentas")
    ingresos_sesiones: float = Field(..., alias="ingresosSesiones")
    costo_nomina: float = Field(..., alias="costoNomina")


class TopMedicamentoDTO(CamelModel):
    medicamento_id: int = Field(..., alias="medicamentoId")
    nombre: str
    cantidad: int


class AtencionEmpleadoDTO(CamelModel):
    empleado_id: int = Field(..., alias="empleadoId")
    nombre: str
    cantidad: int


def _meses_incluyentes(desde: date, hasta: date) -> int:
    return (hasta.year - desde.year) * 12 + (hasta.month - desde.month) + 1


@router.get("/financieros", response_model=ReporteFinancieroDTO)
def financiero(desde: date = Query(...), hasta: date = Query(...), db: Session = Depends(get_db)):
    ingresos_ventas = db.query(func.coalesce(func.sum(Ventas.total), 0.0)).filter(Ventas.fecha.between(desde, hasta)).scalar() or 0.0
    ingresos_sesiones = db.query(func.coalesce(func.sum(Pagosesion.total), 0.0)).filter(Pagosesion.fecha.between(desde, hasta)).scalar() or 0.0
    suma_sueldos = db.query(func.coalesce(func.sum(Empleados.sueldo), 0.0)).scalar() or 0.0
    meses = _meses_incluyentes(desde, hasta)
    costo_nomina = float(suma_sueldos) * float(meses)
    return ReporteFinancieroDTO(
        ingresosVentas=float(ingresos_ventas),
        ingresosSesiones=float(ingresos_sesiones),
        costoNomina=float(costo_nomina),
    )


@router.get("/inventario/minimos", response_model=List[MedicamentosSchema])
def medicamentos_en_minimo(db: Session = Depends(get_db)):
    return db.query(Medicamentos).filter(Medicamentos.stock <= Medicamentos.minimo).all()


@router.get("/inventario/ventas", response_model=List[VentasSchema])
def historial_ventas(desde: date = Query(...), hasta: date = Query(...), db: Session = Depends(get_db)):
    return db.query(Ventas).filter(Ventas.fecha.between(desde, hasta)).order_by(Ventas.id.desc()).all()


@router.get("/inventario/top-medicamentos", response_model=List[TopMedicamentoDTO])
def top_medicamentos(desde: date = Query(...), hasta: date = Query(...), top: int = Query(10), db: Session = Depends(get_db)):
    limit = max(1, min(int(top), 50))
    # join ventas->detalleventa->medicamentos
    q = (
        db.query(
            Detalleventa.medicamento_id.label("medicamento_id"),
            Medicamentos.nombre.label("nombre"),
            func.sum(Detalleventa.cantidad).label("cantidad"),
        )
        .join(Ventas, Ventas.id == Detalleventa.factura_id)
        .join(Medicamentos, Medicamentos.id == Detalleventa.medicamento_id)
        .filter(Ventas.fecha.between(desde, hasta))
        .group_by(Detalleventa.medicamento_id, Medicamentos.nombre)
        .order_by(func.sum(Detalleventa.cantidad).desc())
        .limit(limit)
    )
    return [TopMedicamentoDTO(medicamentoId=int(r.medicamento_id), nombre=r.nombre, cantidad=int(r.cantidad)) for r in q.all()]


@router.get("/clinicos/atencion-por-empleado", response_model=List[AtencionEmpleadoDTO])
def atencion_por_empleado(desde: date = Query(...), hasta: date = Query(...), db: Session = Depends(get_db)):
    # aproximación: pagos de cita agrupados por empleado de la cita
    from app.models.citas import Citas
    q = (
        db.query(
            Citas.empleado_id.label("empleado_id"),
            Empleados.nombre.label("nombre"),
            func.count(Pagosesion.id).label("cantidad"),
        )
        .join(Citas, Pagosesion.cita_id == Citas.id)
        .join(Empleados, Empleados.id == Citas.empleado_id)
        .filter(Pagosesion.fecha.between(desde, hasta))
        .group_by(Citas.empleado_id, Empleados.nombre)
        .order_by(func.count(Pagosesion.id).desc())
    )
    return [AtencionEmpleadoDTO(empleadoId=int(r.empleado_id), nombre=r.nombre, cantidad=int(r.cantidad)) for r in q.all()]


@router.get("/rrhh/costo-nomina", response_model=float)
def costo_nomina(desde: date = Query(...), hasta: date = Query(...), db: Session = Depends(get_db)):
    suma_sueldos = db.query(func.coalesce(func.sum(Empleados.sueldo), 0.0)).scalar() or 0.0
    meses = _meses_incluyentes(desde, hasta)
    return float(suma_sueldos) * float(meses)
