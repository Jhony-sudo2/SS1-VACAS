from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import status

from api.v1.errors.api_exception import ApiException
from api.v1.repositories.UserRepo import UserRepository
from api.v1.repositories.empleado_repo import EmpleadoRepo
from api.v1.repositories.paciente_repo import PacienteRepo
from api.v1.services.mail_service import MailService
from api.v1.services.password_service import hash_password

from api.v1.models.User import Usuario
from api.v1.models.Empleado import Empleado
from api.v1.models.Paciente import Paciente

from api.v1.schemas.UserCreate import UserCreate

class UsuarioService:
    def __init__(self):
        self.usuario_repo = UserRepository()
        self.empleado_repo = EmpleadoRepo()
        self.paciente_repo = PacienteRepo()
        self.mail_service = MailService()

    def save_usuario(self, db: Session, data_create: UserCreate) -> None:
        # validar email
        tmp = self.usuario_repo.find_by_email(db, data_create.usuario.email)
        if tmp:
            raise ApiException("El correo electrónico ya está asociado a una cuenta",
                               status.HTTP_400_BAD_REQUEST)

        # armar usuario
        codigo = self.mail_service.generar_codigo()
        print("contrase;a: ",data_create.usuario.password)
        usuario = Usuario(
            email=data_create.usuario.email,
            password=hash_password(data_create.usuario.password),
            rol=data_create.usuario.rol,   # OJO: si rol es tinyint, usa tu IntEnumType
            a2f=data_create.usuario.a2f,
            emailVerificado=False,
            codigoVerificacion=codigo,
            codigoVerificacionExpira=datetime.now() + timedelta(minutes=15),
            estado=False,  # en tu Java se pone true al confirmar
        )

        # guardar usuario
        usuario = self.usuario_repo.save(db, usuario)

        # guardar empleado/paciente
        if data_create.empleado is not None:
            e = data_create.empleado
            empleado = Empleado(
                colegiado=e.colegiado,
                estadoCivil=e.estadoCivil,
                genero=e.genero,
                fechaNacimiento=e.fechaNacimiento,
                nombre=e.nombre,
                telefono=e.telefono,
                usuarioId=usuario.id,
            )
            self.empleado_repo.save(db, empleado)

        elif data_create.paciente is not None:
            p = data_create.paciente
            paciente = Paciente(
                nombre=p.nombre,
                genero=p.genero,
                estadoCivil=p.estadoCivil,
                direccion=p.direccion,
                nivelEducativo=p.nivelEducativo,
                telefono=p.telefono,
                personaEmergencia=p.personaEmergencia,
                telefonoEmergencia=p.telefonoEmergencia,
                procedencia=p.procedencia,
                usuarioId=usuario.id,
            )
            self.paciente_repo.save(db, paciente)

        # enviar correo
        self.mail_service.enviar_codigo(usuario.email, codigo)

    def confirmar_correo(self, db: Session, codigo: str) -> None:
        usuario = self.usuario_repo.find_by_codigo(db, codigo)
        if not usuario:
            raise ApiException("Código de verificación inválido", status.HTTP_400_BAD_REQUEST)

        if usuario.codigoVerificacionExpira is None or usuario.codigoVerificacionExpira < datetime.now():
            raise ApiException("El código de verificación ha expirado", status.HTTP_400_BAD_REQUEST)

        usuario.emailVerificado = True
        usuario.codigoVerificacion = None
        usuario.codigoVerificacionExpira = None
        usuario.estado = True

        self.usuario_repo.save(db, usuario)

    def update_estado(self, db: Session, id_: int) -> None:
        usuario = self.usuario_repo.find_by_id(db, id_)
        if not usuario:
            raise ApiException("User not found", status.HTTP_404_NOT_FOUND)

        usuario.estado = not bool(usuario.estado)
        self.usuario_repo.save(db, usuario)

    def find_empleado_by_id(self, db: Session, id_: int) -> Empleado:
        empleado = self.empleado_repo.find_by_id(db, id_)
        if not empleado:
            raise ApiException("Empleado no encontrado", status.HTTP_404_NOT_FOUND)
        return empleado

    def find_paciente_by_id(self, db: Session, id_: int) -> Paciente:
        paciente = self.paciente_repo.find_by_id(db, id_)
        if not paciente:
            raise ApiException("Paciente no encontrado", status.HTTP_404_NOT_FOUND)
        return paciente
