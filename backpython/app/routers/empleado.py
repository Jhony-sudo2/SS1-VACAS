from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import Field
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.empleados import Empleados
from app.models.horarios import Horarios
from app.models.descansos import Descansos
from app.models.areas import Areas
from app.models.asignacionarea import Asignacionarea
from app.schemas.common import CamelModel
from app.schemas.generated import AreasSchema, DescansosSchema, EmpleadosSchema, HorariosSchema
from app.schemas.out import EmpleadoOut

router = APIRouter(prefix="/empleado", tags=["empleado"])


class UpdateSalario(CamelModel):
    id: int
    salario: float
    bono: float
    aplica_igss: bool = Field(..., alias="aplicaIgss")


class AsignacionHorarioDTO(CamelModel):
    empleado_id: int = Field(..., alias="empleadoId")
    horario: HorariosSchema
    descansos: List[DescansosSchema]

class AsignarAreaDT(CamelModel):
    idEmpleado:int
    areas:list[int]

@router.put("/salario")
def update_salario(payload: UpdateSalario, db: Session = Depends(get_db)):
    e = db.query(Empleados).filter(Empleados.id == payload.id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    if payload.salario < 0:
        raise HTTPException(status_code=404, detail="El salario no puede ser negativo")
    e.sueldo = payload.salario
    e.bono = payload.bono
    e.aplica_igss = payload.aplica_igss
    db.commit()
    return {"ok": True}


@router.get("", response_model=List[EmpleadoOut])
def all_empleados(db: Session = Depends(get_db)):
    return db.query(Empleados).order_by(Empleados.id.asc()).all()


@router.get("/id", response_model=EmpleadoOut)
def empleado_by_id(id: int = Query(...), db: Session = Depends(get_db)):
    e = db.query(Empleados).filter(Empleados.id == id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return e


@router.post("/asignarHorario")
def asignar_horario(payload: List[AsignacionHorarioDTO], db: Session = Depends(get_db)):
    for item in payload:
        emp = db.query(Empleados).filter(Empleados.id == item.empleado_id).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Empleado no encontrado")

        h_in = item.horario
        h_in.trabaja = True

        existe = db.query(Horarios).filter(Horarios.empleado_id == item.empleado_id, Horarios.dia == h_in.dia).first()
        if not existe:
            h = Horarios(
                empleado_id=item.empleado_id,
                dia=h_in.dia,
                hora_entrada=h_in.hora_entrada,
                hora_salida=h_in.hora_salida,
                trabaja=True,
            )
            db.add(h)
            db.flush()
        else:
            existe.hora_entrada = h_in.hora_entrada
            existe.hora_salida = h_in.hora_salida
            existe.trabaja = True
            h = existe
            db.flush()

        # borrar descansos existentes
        db.query(Descansos).filter(Descansos.horario_id == h.id).delete()

        for d in item.descansos:
            db.add(Descansos(horario_id=int(h.id), inicio=d.inicio, fin=d.fin))

    db.commit()
    return {"ok": True}


@router.get("/horario", response_model=List[AsignacionHorarioDTO])
def horarios_by_empleado(id: int = Query(...), db: Session = Depends(get_db)):
    emp = db.query(Empleados).filter(Empleados.id == id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    horarios = db.query(Horarios).filter(Horarios.empleado_id == id).order_by(Horarios.dia.asc()).all()
    out: List[AsignacionHorarioDTO] = []
    for h in horarios:
        descansos = db.query(Descansos).filter(Descansos.horario_id == h.id).order_by(Descansos.id.asc()).all()
        out.append(AsignacionHorarioDTO(empleadoId=int(emp.id), horario=h, descansos=descansos))
    return out


@router.post("/asignarArea")
def asignar_area(payload: AsignarAreaDT, db: Session = Depends(get_db)):
    id_empleado = payload.idEmpleado
    areas = payload.areas

    if areas is None:
        raise HTTPException(status_code=400, detail="Debe enviar lista de areas")

    emp = db.query(Empleados).filter(Empleados.id == id_empleado).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # Normalizar (por si viene con duplicados)
    nuevas = set(int(x) for x in areas)

    # Validar que todas las áreas existan (en un solo query)
    if nuevas:
        existentes = set(
            r[0] for r in db.query(Areas.id).filter(Areas.id.in_(nuevas)).all()
        )
        faltantes = nuevas - existentes
        if faltantes:
            raise HTTPException(status_code=404, detail=f"Area(s) no encontrada(s): {sorted(faltantes)}")

    # Traer asignaciones actuales del empleado
    actuales_rows = (
        db.query(Asignacionarea)
        .filter(Asignacionarea.empleado_id == id_empleado)
        .all()
    )
    actuales = set(r.area_id for r in actuales_rows)

    # Calcular diferencias
    a_insertar = nuevas - actuales
    a_eliminar = actuales - nuevas

    # Eliminar las que ya no vienen
    if a_eliminar:
        (
            db.query(Asignacionarea)
            .filter(
                Asignacionarea.empleado_id == id_empleado,
                Asignacionarea.area_id.in_(a_eliminar),
            )
            .delete(synchronize_session=False)
        )

    # Insertar las nuevas
    for area_id in a_insertar:
        db.add(Asignacionarea(empleado_id=id_empleado, area_id=area_id))

    db.commit()
    return {
        "ok": True,
        "insertadas": len(a_insertar),
        "eliminadas": len(a_eliminar),
    }


@router.get("/areas", response_model=List[AreasSchema])
def areas_by_empleado(id: int = Query(...), db: Session = Depends(get_db)):
    emp = db.query(Empleados).filter(Empleados.id == id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    area_ids = [int(r.area_id) for r in db.query(Asignacionarea).filter(Asignacionarea.empleado_id == id).all()]
    if not area_ids:
        return []
    return db.query(Areas).filter(Areas.id.in_(area_ids)).all()
