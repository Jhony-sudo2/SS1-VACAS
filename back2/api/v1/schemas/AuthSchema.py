from pydantic import BaseModel, EmailStr, ConfigDict
from api.v1.models.User import Rol

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ConfirmarA2FRequest(BaseModel):
    email: EmailStr
    codigo: str

class UserDto(BaseModel):
    id: int
    email: EmailStr
    rol: int  # 0/1/2 (si querés string, lo cambiamos)

    model_config = ConfigDict(from_attributes=True)

class AuthResponse(BaseModel):
    accessToken: str | None
    tokenType: str
    expiresIn: int
    user: UserDto | None
    mensaje: str | None = None
