import os, time, jwt

class JWTService:
    def __init__(self):
        self.secret = os.getenv("JWT_SECRET", "dev-secret-change-me")
        self.exp_seconds = int(os.getenv("JWT_EXP_SECONDS", "3600"))

    def get_expiration_seconds(self) -> int:
        return self.exp_seconds

    def generate_token(self, usuario) -> str:
        now = int(time.time())
        payload = {
            "sub": str(usuario.id),
            "email": usuario.email,
            "rol": int(usuario.rol),   # si Rol es IntEnum
            "iat": now,
            "exp": now + self.exp_seconds
        }
        return jwt.encode(payload, self.secret, algorithm="HS256")
