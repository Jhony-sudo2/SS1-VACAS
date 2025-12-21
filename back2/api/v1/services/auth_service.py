from datetime import datetime, timedelta
from fastapi import status
from sqlalchemy import text

from api.v1.errors.api_exception import ApiException
from api.v1.repositories.UserRepo import UserRepository
from api.v1.repositories.CodigoConfirmacionRepo import CodigoConfirmacionRepo
from api.v1.services.mail_service import MailService
from api.v1.services.jwt_service import JWTService
from api.v1.services.password_service import verify_password_java  # <- verifica bcrypt raw como Spring
from api.v1.models.codigo_confirmacion import CodigoConfirmacion
from api.v1.schemas.AuthSchema import AuthResponse, UserDto

class AuthService:
    def __init__(self):
        self.usuarioRepo = UserRepository()
        self.mailService = MailService()
        self.codigoRepo = CodigoConfirmacionRepo()
        self.jwtService = JWTService()

    def login(self, email: str, password: str, db):
        usuario = self.usuarioRepo.find_by_email(db, email)
        if not usuario:
            raise ApiException("El usuario no existe", status.HTTP_404_NOT_FOUND)

        if not bool(usuario.estado):
            raise ApiException("El usuario esta desactivado", status.HTTP_400_BAD_REQUEST)

        if not verify_password_java(password, usuario.password):
            raise ApiException("Credenciales incorrectas", status.HTTP_400_BAD_REQUEST)
        if bool(usuario.a2f):
            codigo = self.mailService.generar_codigo()
            self.mailService.enviar_codigo(usuario.email, codigo)

            existe = self.codigoRepo.find_by_email(db, usuario.email)
            if existe:
                self.codigoRepo.delete(db, existe)

            tmp = CodigoConfirmacion(
                codigo=codigo,
                email=usuario.email,
                vencimiento=datetime.now() + timedelta(minutes=15),
            )
            self.codigoRepo.save(db, tmp)

            return AuthResponse(
                accessToken=None,
                tokenType="Bearer",
                expiresIn=self.jwtService.get_expiration_seconds(),
                user=None,
                mensaje=None,
            )

        return self._auth_response(usuario)

    def confirmar_a2f(self, email: str, codigo: str, db):
        usuario = self.usuarioRepo.find_by_email(db, email)
        if not usuario:
            raise ApiException("El usuario no existe", status.HTTP_404_NOT_FOUND)

        confirm = self.codigoRepo.find_by_email(db, email)
        if not confirm:
            raise ApiException("El usuario no existe", status.HTTP_404_NOT_FOUND)

        if confirm.vencimiento and confirm.vencimiento < datetime.now():
            self.codigoRepo.delete(db, confirm)
            raise ApiException("Codigo expirado", status.HTTP_400_BAD_REQUEST)

        if codigo != confirm.codigo:
            raise ApiException("Codigo incorrecto", status.HTTP_400_BAD_REQUEST)

        self.codigoRepo.delete(db, confirm)
        return self._auth_response(usuario)

    def _auth_response(self, usuario):
        token = self.jwtService.generate_token(usuario)
        user = UserDto(id=usuario.id, email=usuario.email, rol=int(usuario.rol))
        return AuthResponse(
            accessToken=token,
            tokenType="Bearer",
            expiresIn=self.jwtService.get_expiration_seconds(),
            user=user,
            mensaje=None,
        )