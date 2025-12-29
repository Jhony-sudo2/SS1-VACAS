from datetime import datetime, timedelta, timezone
from jose import jwt
from app.core.config import settings

ALGORITHM = "HS256"

def create_access_token(user_id: int, email: str, rol: str) -> str:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(milliseconds=settings.jwt_expiration_ms)
    payload = {
        "sub": str(user_id),
        "email": email,
        "rol": rol,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)

def expiration_seconds() -> int:
    return int(settings.jwt_expiration_ms / 1000)
