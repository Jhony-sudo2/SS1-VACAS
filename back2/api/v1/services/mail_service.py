import os
import smtplib
from email.message import EmailMessage
from secrets import randbelow

class MailService:
    def __init__(self):
        self.mail_user = os.getenv("MAIL_USER")
        self.mail_pass = os.getenv("MAIL_PASS")  # app password (sin espacios)
        if not self.mail_user or not self.mail_pass:
            raise RuntimeError("Faltan variables de entorno MAIL_USER/MAIL_PASS")

    def generar_codigo(self) -> str:
        return f"{randbelow(1_000_000):06d}"

    def send_text(self, to: str, subject: str, text: str):
        msg = EmailMessage()
        msg["From"] = self.mail_user
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(text)

        with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.login(self.mail_user, self.mail_pass)
            smtp.send_message(msg)

    def enviar_codigo(self, email: str, codigo: str):
        cuerpo = (
            "Hola,\n\n"
            "Este es tu código de verificación de correo electrónico:\n\n"
            f"{codigo}\n\n"
            "Si tú no creaste esta cuenta, puedes ignorar este correo.\n"
        )
        self.send_text(email, "Confirmación de correo electrónico", cuerpo)
