from __future__ import annotations

from datetime import date, datetime, time, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query,Body
from pydantic import Field
from sqlalchemy import and_, func, or_
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.historias import Historias
from app.models.historiaspersonales import Historiaspersonales
from app.models.antecedentes import Antecedentes
from app.models.estadosiniciales import Estadosiniciales
from app.models.sesiones import Sesiones
from app.models.empresa import Empresa
from app.models.horarios import Horarios
from app.models.descansos import Descansos
from app.models.citas import Citas
from app.models.pruebasaplicadas import Pruebasaplicadas
from app.models.impresiondiagnostica import Impresiondiagnostica
from app.models.tareas import Tareas
from app.models.recetas import Recetas
from app.models.pacientes import Pacientes
from app.models.empleados import Empleados
from app.models.medicamentos import Medicamentos
from app.schemas.common import CamelModel
from app.schemas.generated import AntecedentesSchema, EstadosinicialesSchema, HistoriasSchema, HistoriaspersonalesSchema, ImpresiondiagnosticaSchema, PruebasaplicadasSchema, RecetaOut, SesionesSchema, TareaOut,SesionIn,RecetaIn,TareaIn
from app.schemas.out import HistoriaOut, SesionDetailOut


ESTADO_AGENDADA = 0
ESTADO_PAGADA = 1
ESTADO_CANCELADA = 2
ESTADO_COMPLETADA = 3

HISTORIA_ACTIVO = 0
HISTORIA_ALTA = 1

router = APIRouter(prefix="/historia", tags=["historia"])
def pick(data: dict, mapping: dict) -> dict:
    out = {}
    for in_key, col_key in mapping.items():
        if in_key in data and data[in_key] is not None:
            out[col_key] = data[in_key]
    return out

class HistoriaCreate(CamelModel):
    empleado_id: int = Field(..., alias="empleadoId")
    paciente_id: int = Field(..., alias="pacienteId")
    costo_sesion: float = Field(..., alias="costoSesion")
    duracion: int
    enfoque: int
    fecha_apertura: date = Field(..., alias="fechaApertura")
    frecuencia: int
    modalidad: int
    sesiones: int
    procedencia: str
    motivo_consulta: str = Field(..., alias="motivoConsulta")


class HistoriaCompleta(CamelModel):
    historia_create: HistoriaCreate = Field(..., alias="historiaCreate")
    personal: dict
    antecedente: dict
    estado_inicial: dict = Field(..., alias="estadoInicial")


class HistoriaDetail(CamelModel):
    historia: HistoriasSchema
    historia_personal: HistoriaspersonalesSchema = Field(..., alias="historiaPersonal")
    estado_inicial: EstadosinicialesSchema = Field(..., alias="estadoInicial")
    antecedente: AntecedentesSchema
    sesiones: List[SesionesSchema]


class DarAlta(CamelModel):
    id: int
    motivo: str


class UpdateState(CamelModel):
    id: int
    estado: Optional[int] = None
PERSONAL_MAP = {
    "desarrollo": "desarrollo",
    "historiaAcademica": "historia_academica",
    "historiaMedica": "historia_medica",
    "medicacionActual": "medicacion_actual",
    "tratamientosPrevios": "tratamientos_previos",
    "hospitalizaciones": "hospitalizaciones",
    "alcohol": "alcohol",
    "tabaco": "tabaco",
    "drogas": "drogas",
}
ANTECEDENTE_MAP = {
    "estructura": "estructura",
    "eventos": "eventos",
    "trastornos": "trastornos",
}
ESTADO_INICIAL_MAP = {
    "animmo": "animmo",
    "ansiedad": "ansiedad",
    "apetito": "apetito",
    "suenio": "suenio",
    "observaciones": "observaciones",
    # swagger Java: funcionamientosocial / funcionamientoSocial (depende cómo lo tengas)
    "funcionamientosocial": "funcionamientosocial",
    "funcionamientoSocial": "funcionamientosocial",
}



class SesionDetail(CamelModel):
    sesion: SesionesSchema
    pruebas_aplicadas: List[PruebasaplicadasSchema] = Field(..., alias="pruebasAplicadas")
    impresion_diagnostica: Optional[ImpresiondiagnosticaSchema] = Field(None, alias="impresionDiagnostica")


def _empleado(db: Session, empleado_id: int) -> Empleados:
    e = db.query(Empleados).filter(Empleados.id == empleado_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return e


def _paciente(db: Session, paciente_id: int) -> Pacientes:
    p = db.query(Pacientes).filter(Pacientes.id == paciente_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return p


def _paciente_id_from_usuario(db: Session, usuario_id: int) -> int:
    p = db.query(Pacientes).filter(Pacientes.usuario_id == usuario_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return int(p.id)


@router.post("")
def save_historia(payload: HistoriaCompleta, db: Session = Depends(get_db)):
    h = payload.historia_create
    _empleado(db, h.empleado_id)
    _paciente(db, h.paciente_id)

    historia = Historias(
        empleado_id=h.empleado_id,
        paciente_id=h.paciente_id,
        costo_sesion=h.costo_sesion,
        duracion=h.duracion,
        estado=HISTORIA_ACTIVO,
        enfoque=h.enfoque,
        fecha_apertura=h.fecha_apertura,
        frecuencia=h.frecuencia,
        modalidad=h.modalidad,
        sesiones=h.sesiones,
        procedencia=h.procedencia,
        motivo_consulta=h.motivo_consulta,
    )
    db.add(historia)
    db.flush()

    # PERSONAL
    personal_in = payload.personal or {}
    personal_data = pick(personal_in, PERSONAL_MAP)
    personal_data["historia_id"] = int(historia.id)
    db.add(Historiaspersonales(**personal_data))

    # ANTECEDENTE
    ant_in = payload.antecedente or {}
    ant_data = pick(ant_in, ANTECEDENTE_MAP)
    ant_data["paciente_id"] = int(h.paciente_id)
    db.add(Antecedentes(**ant_data))

    # ESTADO INICIAL
    ei_in = payload.estado_inicial or {}
    ei_data = pick(ei_in, ESTADO_INICIAL_MAP)
    ei_data["historia_id"] = int(historia.id)
    db.add(Estadosiniciales(**ei_data))

    db.commit()
    return {"ok": True, "id": int(historia.id)}


@router.get("", response_model=List[HistoriaOut])
def get_all(db: Session = Depends(get_db)):
    return db.query(Historias).options(joinedload(Historias.empleado).joinedload(Empleados.usuario), joinedload(Historias.paciente).joinedload(Pacientes.usuario)).order_by(Historias.id.desc()).all()


@router.get("/empleado", response_model=List[HistoriaOut])
def find_by_empleado(id: int = Query(...), db: Session = Depends(get_db)):
    _empleado(db, id)
    return db.query(Historias).options(joinedload(Historias.empleado).joinedload(Empleados.usuario), joinedload(Historias.paciente).joinedload(Pacientes.usuario)).filter(Historias.empleado_id == id).order_by(Historias.id.desc()).all()


@router.get("/paciente", response_model=List[HistoriaOut])
def find_by_paciente(id: int = Query(...), db: Session = Depends(get_db)):
    paciente_id = _paciente_id_from_usuario(db, id)
    return db.query(Historias).options(joinedload(Historias.empleado).joinedload(Empleados.usuario), joinedload(Historias.paciente).joinedload(Pacientes.usuario)).filter(Historias.paciente_id == paciente_id).order_by(Historias.id.desc()).all()


@router.get("/id", response_model=HistoriaOut)
def find_historia_by_id(id: int = Query(...), db: Session = Depends(get_db)):
    historia = db.query(Historias).options(joinedload(Historias.empleado).joinedload(Empleados.usuario), joinedload(Historias.paciente).joinedload(Pacientes.usuario)).filter(Historias.id == id).first()
    if not historia:
        raise HTTPException(status_code=404, detail="Historia no encontrada")
    return historia


@router.get("/details", response_model=HistoriaDetail)
def details(id: int = Query(...), db: Session = Depends(get_db)):
    historia = db.query(Historias).options(joinedload(Historias.empleado).joinedload(Empleados.usuario), joinedload(Historias.paciente).joinedload(Pacientes.usuario)).filter(Historias.id == id).first()
    if not historia:
        raise HTTPException(status_code=404, detail="Historia no encontrada")

    antecedente = db.query(Antecedentes).filter(Antecedentes.paciente_id == historia.paciente_id).first()
    if not antecedente:
        raise HTTPException(status_code=404, detail="Antecedente no encontrado")

    estado_inicial = db.query(Estadosiniciales).filter(Estadosiniciales.historia_id == id).first()
    if not estado_inicial:
        raise HTTPException(status_code=404, detail="Estado inicial no encontrado")

    historia_personal = db.query(Historiaspersonales).filter(Historiaspersonales.historia_id == id).first()
    if not historia_personal:
        raise HTTPException(status_code=404, detail="Historia personal no encontrada")

    sesiones = db.query(Sesiones).filter(Sesiones.historia_id == id).order_by(Sesiones.numero.asc()).all()

    return HistoriaDetail(
        historia=historia,
        historiaPersonal=historia_personal,
        estadoInicial=estado_inicial,
        antecedente=antecedente,
        sesiones=sesiones,
    )


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


@router.get("/horarios", response_model=List[datetime])
def horarios_disponibles(id: int = Query(...), fecha: date = Query(...), duracion: int = Query(...), db: Session = Depends(get_db)):
    _empleado(db, id)
    dia = fecha.isoweekday()  # 1..7
    horario = db.query(Horarios).filter(Horarios.empleado_id == id, Horarios.dia == dia).first()
    if not horario or not bool(horario.trabaja):
        return []

    inicio_jornada = datetime.combine(fecha, horario.hora_entrada)
    fin_jornada = datetime.combine(fecha, horario.hora_salida)
    if inicio_jornada + timedelta(minutes=duracion) > fin_jornada:
        return []

    ini_dia = datetime.combine(fecha, time.min)
    fin_dia = datetime.combine(fecha + timedelta(days=1), time.min)

    ocupados: List[tuple[datetime, datetime]] = []

    descansos = db.query(Descansos).filter(Descansos.horario_id == horario.id).all()
    for d in descansos:
        a = datetime.combine(fecha, d.inicio)
        b = datetime.combine(fecha, d.fin)
        if b > a:
            ocupados.append((a, b))

    empresa = db.query(Empresa).filter(Empresa.id == 1).first()
    duracion_cita = int(empresa.tiempo_cita) if empresa else 0
    if duracion_cita <= 0:
        duracion_cita = 15

    citas = db.query(Citas).filter(
        Citas.empleado_id == id,
        Citas.fecha >= ini_dia,
        Citas.fecha < fin_dia,
        Citas.estado != ESTADO_CANCELADA,
    ).all()
    for c in citas:
        a = c.fecha
        b = a + timedelta(minutes=duracion_cita)
        ocupados.append((a, b))

    sesiones = db.query(Sesiones).join(Historias, Sesiones.historia_id == Historias.id).filter(
        Historias.empleado_id == id,
        Sesiones.fecha >= ini_dia,
        Sesiones.fecha < fin_dia,
    ).all()
    for s in sesiones:
        # duración = historia.duracion
        historia = db.query(Historias).filter(Historias.id == s.historia_id).first()
        dur = int(historia.duracion) if historia and historia.duracion else 0
        if dur <= 0:
            continue
        a = s.fecha
        b = a + timedelta(minutes=dur)
        ocupados.append((a, b))

    ocupados_m = _merge(ocupados)

    step = 15
    disponibles: List[datetime] = []
    t = inicio_jornada
    while t + timedelta(minutes=duracion) <= fin_jornada:
        a1, b1 = t, t + timedelta(minutes=duracion)
        if not any(_solapa(a1, b1, a2, b2) for a2, b2 in ocupados_m):
            disponibles.append(t)
        t = t + timedelta(minutes=step)
    return disponibles


@router.post("/sesion")
def crear_sesion(payload: SesionIn = Body(...), db: Session = Depends(get_db)):

    historia_id = payload.historia_id
    if not historia_id and payload.historia:
        historia_id = payload.historia.get("id")

    if not historia_id:
        raise HTTPException(status_code=422, detail="Debe enviar historiaId o historia.id")

    historia = db.query(Historias).filter(Historias.id == int(historia_id)).first()
    if not historia:
        raise HTTPException(status_code=404, detail="Historia no encontrada")

    paciente_id = int(historia.paciente_id)

    pendientes = (
        db.query(Sesiones)
        .join(Historias, Sesiones.historia_id == Historias.id)
        .filter(
            Historias.paciente_id == paciente_id,
            Sesiones.estado == ESTADO_AGENDADA,
        )
        .all()
    )
    if pendientes:
        raise HTTPException(status_code=404, detail="El paciente tiene sesiones pendientes de pago")

    estado_int = None
    if payload.estado is not None:
        if isinstance(payload.estado, str):
            estado_int = ESTADO_AGENDADA
            if estado_int is None:
                raise HTTPException(status_code=422, detail=f"Estado inválido: {payload.estado}")
        else:
            estado_int = int(payload.estado)

    sesion = Sesiones(
        historia_id=int(historia_id),
        numero=payload.numero,
        fecha=payload.fecha,
        estado=estado_int if estado_int is not None else ESTADO_AGENDADA,
        justificacion=payload.justificacion,
        temas=payload.temas,
        respuestas=payload.respuestas,
        observaciones=payload.observaciones,
        estado_pago=bool(payload.estado_pago) if payload.estado_pago is not None else False,
    )

    db.add(sesion)
    db.commit()
    db.refresh(sesion)
    return {"ok": True, "id": int(sesion.id)}


@router.get("/sesion", response_model=List[SesionesSchema])
def all_sesiones(db: Session = Depends(get_db)):
    return db.query(Sesiones).order_by(Sesiones.id.desc()).all()


@router.get("/sesionHistoria", response_model=List[SesionesSchema])
def sesion_by_historia(id: int = Query(...), db: Session = Depends(get_db)):
    return db.query(Sesiones).filter(Sesiones.historia_id == id).order_by(Sesiones.numero.asc()).all()


@router.post("/prueba")
def guardar_prueba(payload: PruebasaplicadasSchema, db: Session = Depends(get_db)):
    db.add(payload)
    db.commit()
    return {"ok": True}


@router.post("/impresion")
def guardar_impresion(payload: ImpresiondiagnosticaSchema, db: Session = Depends(get_db)):
    db.add(payload)
    db.commit()
    return {"ok": True}


@router.get("/sesion/details", response_model=SesionDetail)
def detalle_sesion(id: int = Query(...), db: Session = Depends(get_db)):
    sesion = db.query(Sesiones).filter(Sesiones.id == id).first()
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesion no econtrada")
    pruebas = db.query(Pruebasaplicadas).filter(Pruebasaplicadas.sesion_id == id).all()
    imp = db.query(Impresiondiagnostica).filter(Impresiondiagnostica.sesion_id == id).first()
    return SesionDetail(sesion=sesion, pruebasAplicadas=pruebas, impresionDiagnostica=imp)


@router.get("/sesion/pacienteId", response_model=List[SesionesSchema])
def sesiones_por_paciente(id: int = Query(...), db: Session = Depends(get_db)):
    paciente_id = _paciente_id_from_usuario(db, id)
    return (
        db.query(Sesiones)
        .join(Historias, Sesiones.historia_id == Historias.id)
        .filter(Historias.paciente_id == paciente_id)
        .order_by(Sesiones.id.desc())
        .all()
    )


@router.get("/sesion/id", response_model=SesionesSchema)
def sesion_por_id(id: int = Query(...), db: Session = Depends(get_db)):
    sesion = db.query(Sesiones).filter(Sesiones.id == id).first()
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesion no econtrada")
    return sesion


@router.post("/darAlta")
def dar_alta(payload: DarAlta, db: Session = Depends(get_db)):
    historia = db.query(Historias).filter(Historias.id == payload.id).first()
    if not historia:
        raise HTTPException(status_code=404, detail="Historia no encontrada")
    historia.motivo_alta = payload.motivo
    historia.estado = HISTORIA_ALTA
    db.commit()
    return {"ok": True}


@router.post("/tarea")
def save_tarea(payload: TareaIn, db: Session = Depends(get_db)):
    pac_id = payload.paciente_id or (payload.paciente or {}).get("id")
    if not pac_id:
        raise HTTPException(status_code=422, detail="Debe enviar pacienteId o paciente.id")

    t = Tareas(
        estado=False,
        paciente_id=int(pac_id),
        instrucciones=payload.instrucciones,
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return {"ok": True, "id": int(t.id)}


@router.get("/tarea", response_model=List[TareaOut])
def get_tareas(id: int = Query(...), db: Session = Depends(get_db)):
    paciente_id = _paciente_id_from_usuario(db, id)
    return db.query(Tareas).filter(Tareas.paciente_id == paciente_id).order_by(Tareas.id.desc()).all()


@router.post("/receta")
def save_receta(payload: list[RecetaIn], db: Session = Depends(get_db)):

    rows = []
    for item in payload:
        med_id = item.medicamento_id or (item.medicamento or {}).get("id")
        pac_id = item.paciente_id or (item.paciente or {}).get("id")
        ses_id = item.sesion_id
        if ses_id is None:
            if isinstance(item.sesion, int):
                ses_id = item.sesion
            elif isinstance(item.sesion, dict):
                ses_id = item.sesion.get("id")

        if not med_id or not pac_id:
            raise HTTPException(status_code=422, detail="Debe enviar medicamento.id y paciente.id")

        receta = Recetas(
            medicamento_id=int(med_id),
            paciente_id=int(pac_id),
            sesion=int(ses_id) if ses_id not in (None, 0) else None,  # si 0 significa null
            indicaciones=item.indicaciones,
            cantidad=item.cantidad,
        )
        rows.append(receta)

    db.add_all(rows)
    db.commit()
    return {"ok": True, "insertados": len(rows)}

@router.get("/receta", response_model=List[RecetaOut])
def get_recetas(id: int = Query(...), db: Session = Depends(get_db)):
    paciente_id = _paciente_id_from_usuario(db, id)

    data = (
        db.query(Recetas)
        .options(
            joinedload(Recetas.medicamento),
            joinedload(Recetas.paciente).joinedload(Pacientes.usuario),
        )
        .filter(Recetas.paciente_id == paciente_id)
        .order_by(Recetas.id.desc())
        .all()
    )
    return data


@router.post("/tarea/completar")
def completar_tarea(payload: UpdateState, db: Session = Depends(get_db)):
    tarea = db.query(Tareas).filter(Tareas.id == payload.id).first()
    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    tarea.estado = True
    db.commit()
    return {"ok": True}
