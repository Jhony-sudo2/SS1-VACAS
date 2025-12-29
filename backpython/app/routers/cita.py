from __future__ import annotations

from datetime import date, datetime, time, timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import Field
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.citas import Citas
from app.models.empresa import Empresa
from app.models.asignacionservicio import Asignacionservicio
from app.models.asignacionarea import Asignacionarea
from app.models.empleados import Empleados
from app.models.horarios import Horarios
from app.models.descansos import Descansos
from app.models.sesiones import Sesiones
from app.models.historias import Historias
from app.models.pacientes import Pacientes
from app.schemas.common import CamelModel
from app.schemas.generated import CitasSchema
from app.schemas.out import CitaOut
from sqlalchemy.orm import joinedload
from app.models.servicios import Servicios

ESTADO_AGENDADA = 0
ESTADO_PAGADA = 1
ESTADO_CANCELADA = 2
ESTADO_COMPLETADA = 3

router = APIRouter(prefix="/cita", tags=["cita"])


class DisponibilidadCita(CamelModel):
    empleado_id: int
    nombre_empleado: str
    horarios_disponibles: List[datetime]


class CitaCreate(CamelModel):
    empleado_id: int = Field(..., alias="empleadoId")
    paciente_id: int = Field(..., alias="pacienteId")  # usuarioId del paciente
    fecha: datetime


class UpdateState(CamelModel):
    id: int
    estado: int


def _merge(intervals: List[tuple[datetime, datetime]]) -> List[tuple[datetime, datetime]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    out = [intervals[0]]
    for a, b in intervals[1:]:
        la, lb = out[-1]
        if a <= lb:
            out[-1] = (la, max(lb, b))
        else:
            out.append((a, b))
    return out


def _solapa(a1: datetime, b1: datetime, a2: datetime, b2: datetime) -> bool:
    return a1 < b2 and a2 < b1


def _paciente_id_from_usuario(db: Session, usuario_id: int) -> int:
    p = db.query(Pacientes).filter(Pacientes.usuario_id == usuario_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return int(p.id)


@router.get("/disponibilidad", response_model=List[DisponibilidadCita])
def disponibilidad(idServicio: int = Query(...), fecha: date = Query(...), db: Session = Depends(get_db)):

    # 0) validar servicio exista (como Java)
    existe_serv = db.query(Servicios.id).filter(Servicios.id == idServicio).first()
    if not existe_serv:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    area_ids = sorted({
        int(r.area_id)
        for r in db.query(Asignacionservicio.area_id).filter(Asignacionservicio.servicio_id == idServicio).all()
    })
    if not area_ids:
        return []

    empleado_ids = sorted({
        int(r.empleado_id)
        for r in db.query(Asignacionarea.empleado_id).filter(Asignacionarea.area_id.in_(area_ids)).all()
    })
    if not empleado_ids:
        return []

    empresa = db.query(Empresa).filter(Empresa.id == 1).first()
    duracion_cita = int(empresa.tiempo_cita) if empresa and empresa.tiempo_cita else 15
    if duracion_cita <= 0:
        raise HTTPException(status_code=500, detail="Empresa.tiempo_cita inválido")

    dia = fecha.isoweekday()  # 1..7 igual que Java
    ini_dia = datetime.combine(fecha, time.min)
    fin_dia = datetime.combine(fecha + timedelta(days=1), time.min)

    out: List[DisponibilidadCita] = []

    for emp_id in empleado_ids:
        emp = db.query(Empleados).filter(Empleados.id == emp_id).first()
        if not emp:
            continue

        h = db.query(Horarios).filter(Horarios.empleado_id == emp_id, Horarios.dia == dia).first()
        if not h or not bool(h.trabaja):
            continue

        inicio_jornada = datetime.combine(fecha, h.hora_entrada)
        fin_jornada = datetime.combine(fecha, h.hora_salida)

        ocupados: List[tuple[datetime, datetime]] = []

        for d in db.query(Descansos).filter(Descansos.horario_id == h.id).all():
            a = datetime.combine(fecha, d.inicio)
            b = datetime.combine(fecha, d.fin)
            if b > a:
                ocupados.append((a, b))

        citas = db.query(Citas).filter(
            Citas.empleado_id == emp_id,
            Citas.fecha >= ini_dia,
            Citas.fecha < fin_dia,
            Citas.estado != ESTADO_CANCELADA,
        ).all()
        for c in citas:
            a = c.fecha
            b = a + timedelta(minutes=duracion_cita)
            ocupados.append((a, b))

        sesiones = (
            db.query(Sesiones)
            .options(joinedload(Sesiones.historia))
            .join(Historias, Sesiones.historia_id == Historias.id)
            .filter(
                Historias.empleado_id == emp_id,
                Sesiones.fecha >= ini_dia,
                Sesiones.fecha < fin_dia,
            )
            .all()
        )
        for s in sesiones:
            dur = int(s.historia.duracion) if s.historia and s.historia.duracion else 0
            if dur <= 0:
                continue
            a = s.fecha
            b = a + timedelta(minutes=dur)
            ocupados.append((a, b))

        ocupados_m = _merge(ocupados)

        # Slots cada 15 min
        step = 15
        disponibles: List[datetime] = []
        t = inicio_jornada
        while t + timedelta(minutes=duracion_cita) <= fin_jornada:
            a1, b1 = t, t + timedelta(minutes=duracion_cita)
            if not any(_solapa(a1, b1, a2, b2) for a2, b2 in ocupados_m):
                disponibles.append(t)
            t = t + timedelta(minutes=step)

        if disponibles:
            out.append(
                DisponibilidadCita(
                    empleado_id=emp_id,
                    nombre_empleado=emp.nombre,
                    horarios_disponibles=disponibles,
                )
            )

    return out


@router.post("/agendar")
def agendar(payload: CitaCreate, db: Session = Depends(get_db)):
    emp = db.query(Empleados).filter(Empleados.id == payload.empleado_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    paciente_id = _paciente_id_from_usuario(db, payload.paciente_id)

    pendientes = db.query(Citas).filter(Citas.paciente_id == paciente_id, Citas.estado == ESTADO_AGENDADA).all()
    if pendientes:
        raise HTTPException(status_code=406, detail="Tienes citas pendientes de pagas")

    cita = Citas(
        empleado_id=payload.empleado_id,
        paciente_id=paciente_id,
        fecha=payload.fecha,
        estado=ESTADO_AGENDADA,
    )
    db.add(cita)
    db.commit()
    return {"ok": True, "id": int(cita.id)}


@router.post("/update")
def update_state(payload: UpdateState, db: Session = Depends(get_db)):
    c = db.query(Citas).filter(Citas.id == payload.id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    c.estado = payload.estado
    db.commit()
    return {"ok": True}


@router.get("/empleado", response_model=List[CitaOut])
def citas_empleado(id: int = Query(...), db: Session = Depends(get_db)):
    return db.query(Citas).filter(Citas.empleado_id == id).order_by(Citas.fecha.desc()).all()


@router.get("/paciente", response_model=List[CitaOut])
def citas_paciente(id: int = Query(...), db: Session = Depends(get_db)):
    paciente_id = _paciente_id_from_usuario(db, id)
    return db.query(Citas).filter(Citas.paciente_id == paciente_id).order_by(Citas.fecha.desc()).all()


@router.get("", response_model=List[CitaOut])
def all_citas(db: Session = Depends(get_db)):
    return db.query(Citas).order_by(Citas.fecha.desc()).all()


@router.get("/id", response_model=CitaOut)
def cita_by_id(id: int = Query(...), db: Session = Depends(get_db)):
    c = db.query(Citas).filter(Citas.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return c
