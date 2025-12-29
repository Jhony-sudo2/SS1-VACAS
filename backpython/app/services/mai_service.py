import os
import smtplib
from email.message import EmailMessage
from typing import Optional
import secrets

def _env_bool(name: str, default: bool = False) -> bool:
    v = (os.getenv(name) or "").strip().lower()
    if v in ("1", "true", "yes", "y", "on"):
        return True
    if v in ("0", "false", "no", "n", "off"):
        return False
    return default

class MailService:
    def __init__(self):
        self.host = os.getenv("MAIL_HOST")
        self.port = int(os.getenv("MAIL_PORT") or 587)
        self.username = os.getenv("MAIL_USERNAME")
        self.password = os.getenv("MAIL_PASSWORD")
        self.starttls = _env_bool("MAIL_STARTTLS", True)

        # Si falta config, no enviamos (opcional)
        self.enabled = all([self.host, self.port, self.username, self.password])

    def send_text(self, to: str, subject: str, text: str) -> None:
        if not self.enabled:
            # En dev podrías loguear en vez de enviar
            print("[MAIL] disabled - would send to:", to, "subject:", subject)
            print(text)
            return

        msg = EmailMessage()
        msg["From"] = self.username
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(text)

        with smtplib.SMTP(self.host, self.port) as server:
            server.ehlo()
            if self.starttls:
                server.starttls()
                server.ehlo()
            server.login(self.username, self.password)
            server.send_message(msg)

    def enviar_codigo(self, subject: str, email: str, codigo: str) -> None:
        cuerpo = f"""Hola,

Este es tu código de verificación desde backend python:

{codigo}
"""
        self.send_text(email, subject, cuerpo)

    def enviar_notificacion(self, subject: str, email: str, mensaje: str) -> None:
        cuerpo = f"""Hola,
{mensaje}
"""
        self.send_text(email, subject, cuerpo)

    def generar_codigo(self) -> str:
        # 6 dígitos como Java
        return f"{secrets.randbelow(1_000_000):06d}"
