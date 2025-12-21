import bcrypt
import hashlib

def hash_password(raw: str) -> str:
    raw_bytes = raw.encode("utf-8")
    if len(raw_bytes) > 72:
        raise ValueError("Password supera 72 bytes (límite bcrypt).")
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(raw_bytes, salt).decode("utf-8")


def verify_password(raw: str, hashed: str) -> bool:
    digest = hashlib.sha256(raw.encode("utf-8")).digest()
    return bcrypt.checkpw(digest, hashed.encode("utf-8"))

def verify_password_java(raw: str, hashed: str) -> bool:
    raw_bytes = raw.encode("utf-8")
    hashed_bytes = hashed.encode("utf-8")
    if hashed.startswith("$2a$"):
        hashed_bytes = ("$2b$" + hashed[4:]).encode("utf-8")
    if len(raw_bytes) > 72:
        return False
    return bcrypt.checkpw(raw_bytes, hashed_bytes)