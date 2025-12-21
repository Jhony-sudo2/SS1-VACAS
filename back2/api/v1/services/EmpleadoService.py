from api.v1.errors.api_exception import ApiException
from api.v1.models.AsignacionArea import AsignacionArea
from api.v1.repositories.empleado_repo import EmpleadoRepo
from api.v1.repositories.HorarioRepo import HorarioRepo,DescansoRepo
from api.v1.schemas.Horario import AsignarHorario
from api.v1.schemas.Area import AsignarArea
from sqlalchemy.orm import Session
from api.v1.models.Empleado import Empleado
from api.v1.models.Area import Area
from api.v1.models.Horario import Horario,Descanso
from fastapi import status

class EmpleadoService:
    def __init__(self):
        self.horarioRepo = HorarioRepo()
        self.descansoRepo = DescansoRepo()
        self.empleadoRepo = EmpleadoRepo()
    

    def get_all_empleados(self,db:Session)->list[Empleado]:
        return self.empleadoRepo.find_all(db)

    def find_by_id(self,db:Session,id:int)->Empleado:
        return self.empleadoRepo.find_by_id(db,id_=id)
    
    def find_areas(self,db:Session,id:int)->list[Area]:
        return self.empleadoRepo.get_areas_by_empleado(db,id)
    
    def asignar_horario(self, db: Session, payload: list[AsignarHorario]):
        try:
            for item in payload:
                item.horario.trabaja = True

                existe = self.horarioRepo.find_by_empleado_id_and_dia(
                    db, item.empleadoId, item.horario.dia
                )

                if not existe:
                    horario = Horario(
                        empleadoId=item.empleadoId,
                        dia=item.horario.dia,
                        horaEntrada=item.horario.horaEntrada,
                        horaSalida=item.horario.horaSalida,
                        trabaja=True,
                    )
                    self.horarioRepo.save(db, horario)
                else:
                    existe.horaEntrada = item.horario.horaEntrada
                    existe.horaSalida = item.horario.horaSalida
                    existe.trabaja = True
                    horario = existe

                self.descansoRepo.delete_all_by_horario_id(db, horario.id)

                for d in item.descansos:
                    db.add(Descanso(horarioId=horario.id, inicio=d.inicio, fin=d.fin))

            db.commit()
        except Exception:
            db.rollback()
            raise
        
    def get_horarios_by_empleado_id(self, db: Session, empleado_id: int):
        self.find_by_id(db, empleado_id)
        result = []
        horarios = self.horarioRepo.find_all_by_empleado_id(db, empleado_id)
        for h in horarios:
            descansos = self.descansoRepo.find_all_by_horario_id(db, h.id)
            result.append({
                "empleadoId": empleado_id,
                "horario": h,
                "descansos": descansos
            })
        return result
    
    def asignar_areas(self, db: Session, data: AsignarArea):
        empleado = self.find_by_id(db, data.idEmpleado)

        try:
            for id_area in data.areas:
                area = db.query(Area).filter(Area.id == id_area).first()
                if not area:
                    raise ApiException("Area no encontrada", status.HTTP_404_NOT_FOUND)

                # Evitar duplicados (si ya existe la asignación)
                existe = (
                    db.query(AsignacionArea)
                    .filter(
                        AsignacionArea.empleadoId == data.idEmpleado,
                        AsignacionArea.areaId == id_area,
                    )
                    .first()
                )
                if existe:
                    continue

                nueva = AsignacionArea(
                    empleadoId=data.idEmpleado,
                    areaId=id_area
                )
                db.add(nueva)

            db.commit()
        except Exception:
            db.rollback()
            raise
