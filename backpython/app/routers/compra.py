from __future__ import annotations

from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import Field
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.medicamentos import Medicamentos
from app.models.detalleventa import Detalleventa
from app.models.ventas import Ventas
from app.models.pagosesion import Pagosesion
from app.models.recetas import Recetas
from app.models.sesiones import Sesiones
from app.models.citas import Citas
from app.models.empresa import Empresa
from app.models.pacientes import Pacientes
from app.schemas.common import CamelModel
from app.schemas.generated import DetalleventaSchema, MedicamentosSchema, PagosesionSchema, VentasSchema
from app.schemas.out import VentaOut,PagoSesionOut


# Enums (ordinales) según tu backend Spring
ESTADO_AGENDADA = 0
ESTADO_PAGADA = 1
ESTADO_CANCELADA = 2
ESTADO_COMPLETADA = 3


router = APIRouter(prefix="/compra", tags=["compra"])


class UpdateEstado(CamelModel):
    id: int


class CompraDetalle(CamelModel):
    medicamento_id: int = Field(..., alias="medicamentoId")
    cantidad: int


class CompraDTO(CamelModel):
    paciente_id: int = Field(..., alias="pacienteId")  
    detalle: List[CompraDetalle]
    tipo: bool
    tarjeta: Optional[str] = None
    codigo: Optional[str] = None
    fecha_vencimiento: Optional[str] = Field(default=None, alias="fechaVencimiento")


class ResponseReceta(CamelModel):
    medicamento: MedicamentosSchema
    cantidad: int


def _paciente_id_from_usuario(db: Session, usuario_id: int) -> int:
    p = db.query(Pacientes).filter(Pacientes.usuario_id == usuario_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return int(p.id)


@router.get("/receta", response_model=List[ResponseReceta])
def compra_con_receta(id: int = Query(...), db: Session = Depends(get_db)):
    """Spring: GET /compra/receta?id=<sesionId>"""
    recetas = db.query(Recetas).filter(Recetas.sesion == id).all()
    out: List[ResponseReceta] = []
    for r in recetas:
        med = db.query(Medicamentos).filter(Medicamentos.id == r.medicamento_id).first()
        if not med:
            continue
        out.append(ResponseReceta(medicamento=med, cantidad=int(r.cantidad)))
    return out


@router.post("/normal")
def compra_normal(compra: CompraDTO, db: Session = Depends(get_db)):
    """Spring: POST /compra/normal"""
    paciente_id = _paciente_id_from_usuario(db, compra.paciente_id)

    total = 0.0
    detalle_rows: List[DetalleventaSchema] = []

    for d in compra.detalle:
        med = db.query(Medicamentos).filter(Medicamentos.id == d.medicamento_id).with_for_update().first()
        if not med:
            raise HTTPException(status_code=404, detail="Medicamento no encontrado")
        if (med.stock or 0) < d.cantidad:
            raise HTTPException(status_code=400, detail="STOCK NO SUFICIENTE")

        med.stock = int(med.stock or 0) - int(d.cantidad)
        total += float(med.precio) * int(d.cantidad)

        detalle_rows.append(Detalleventa(cantidad=int(d.cantidad), medicamento_id=int(med.id)))
    print('TIPO DE COMPRA: ',compra.tipo)
    venta = Ventas(
        paciente_id=paciente_id,
        total=total,
        fecha=date.today(),
        estado_entrega=(not compra.tipo),
        tarjeta=compra.tarjeta if compra.tipo else None,
        codigo=compra.codigo if compra.tipo else None,
        fecha_vencimiento=None,
    )

    db.add(venta)
    db.flush() 

    for det in detalle_rows:
        det.factura_id = int(venta.id)
        db.add(det)

    db.commit()
    return {"ok": True, "idVenta": int(venta.id)}


@router.post("/entregar")
def entregar_venta(payload: UpdateEstado, db: Session = Depends(get_db)):
    venta = db.query(Ventas).filter(Ventas.id == payload.id).first()
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no existente")
    venta.estado_entrega = True
    db.commit()
    return {"ok": True}


@router.get("/venta", response_model=List[VentaOut])
def mis_ventas(id: int = Query(...), db: Session = Depends(get_db)):
    print(id)
    paciente_id = _paciente_id_from_usuario(db, id)
    data = db.query(Ventas).filter(Ventas.paciente_id == paciente_id).order_by(Ventas.id.desc()).all()
    return data

@router.get("/ventas", response_model=List[VentaOut])
def all_ventas(db: Session = Depends(get_db)):
    return db.query(Ventas).order_by(Ventas.id.desc()).all()


@router.get("/venta/detalle", response_model=List[ResponseReceta])
def detalle_venta(id: int = Query(...), db: Session = Depends(get_db)):
    detalles = db.query(Detalleventa).filter(Detalleventa.factura_id == id).all()
    out: List[ResponseReceta] = []
    for det in detalles:
        med = db.query(Medicamentos).filter(Medicamentos.id == det.medicamento_id).first()
        if not med:
            continue
        out.append(ResponseReceta(medicamento=med, cantidad=int(det.cantidad)))
    return out


@router.get("/venta/id", response_model=VentaOut)
def venta_por_id(id: int = Query(...), db: Session = Depends(get_db)):
    venta = db.query(Ventas).options(joinedload(Ventas.paciente).joinedload(Pacientes.usuario), joinedload(Ventas.detalle).joinedload(Detalleventa.medicamento)).filter(Ventas.id == id).first()
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no existe")
    return venta


class RefId(CamelModel):
    id: int

class PagoSesionIn(CamelModel):
    # Forma simple (la que ya usas)
    cita_id: Optional[int] = Field(default=None, alias="citaId")
    sesion_id: Optional[int] = Field(default=None, alias="sesionId")

    # Forma Java (anidada)
    cita: Optional[RefId] = None
    sesion: Optional[RefId] = None

    tarjeta: Optional[str] = None
    codigo: Optional[str] = None
    fecha_vencimiento: Optional[str] = Field(default=None, alias="fechaVencimiento")


@router.post("/sesion")
def pagar_sesion(payload: PagoSesionIn, db: Session = Depends(get_db)):
    # 1) normalizar ids: si vienen anidados, tomar esos
    cita_id = payload.cita_id or (payload.cita.id if payload.cita else None)
    sesion_id = payload.sesion_id or (payload.sesion.id if payload.sesion else None)

    if not cita_id and not sesion_id:
        raise HTTPException(status_code=400, detail="Debe enviar citaId o sesionId")

    # 2) pagar sesión (si viene sesion_id)
    if sesion_id and not cita_id:
        sesion = db.query(Sesiones).filter(Sesiones.id == int(sesion_id)).first()
        if not sesion:
            raise HTTPException(status_code=404, detail="Sesion no encontrada")

        historia = sesion.historia  # usa relationship
        total = float(historia.costo_sesion) if historia else 0.0

        sesion.estado = ESTADO_PAGADA
        sesion.estado_pago = True

        pago = Pagosesion(
            sesion_id=int(sesion_id),
            cita_id=None,
            total=total,
            fecha=date.today(),
            tarjeta=payload.tarjeta,
            codigo=payload.codigo,
            fecha_vencimiento=payload.fecha_vencimiento,
        )
        db.add(pago)
        db.commit()
        return {"ok": True}

    # 3) pagar cita
    empresa = db.query(Empresa).filter(Empresa.id == 1).first()
    total = float(empresa.precio_cita) if empresa else 0.0

    cita = db.query(Citas).filter(Citas.id == int(cita_id)).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    cita.estado = ESTADO_PAGADA

    pago = Pagosesion(
        sesion_id=None,
        cita_id=int(cita_id),
        total=total,
        fecha=date.today(),
        tarjeta=payload.tarjeta,
        codigo=payload.codigo,
        fecha_vencimiento=payload.fecha_vencimiento,
    )
    db.add(pago)
    db.commit()
    return {"ok": True}

@router.get("/sesion", response_model=List[PagoSesionOut])
def mis_pagos_sesion(id: int = Query(...), db: Session = Depends(get_db)):
    """Spring: GET /compra/sesion?id=<usuarioPacienteId>"""
    paciente_id = _paciente_id_from_usuario(db, id)

    # pagos por cita del paciente
    # pagos por sesion donde la historia pertenece al paciente
    pagos = []

    pagos.extend(db.query(Pagosesion).join(Citas, Pagosesion.cita_id == Citas.id).filter(Citas.paciente_id == paciente_id).all())

    from app.models.historias import Historias
    pagos.extend(
        db.query(Pagosesion)
        .join(Sesiones, Pagosesion.sesion_id == Sesiones.id)
        .join(Historias, Sesiones.historia_id == Historias.id)
        .filter(Historias.paciente_id == paciente_id)
        .all()
    )
    uniq = {int(p.id): p for p in pagos}
    return list(uniq.values())
