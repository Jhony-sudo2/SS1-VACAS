package com.example.ss1.services;

import java.security.SecureRandom;

import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.ss1.models.Usuario;

import jakarta.mail.internet.MimeMessage;

@Service
public class MailService {
    private final JavaMailSender mailSender;
    private static final SecureRandom random = new SecureRandom();
    public MailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }

      // Texto plano
    public void sendText(String to, String subject, String text) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(text);
        mailSender.send(msg);
    }

    // HTML + adjuntos
    public void sendHtml(String to, String subject, String html, String pathAdjunto) throws Exception {
        MimeMessage mime = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true); // true = HTML

        if (pathAdjunto != null) {
            FileSystemResource file = new FileSystemResource(pathAdjunto);
            helper.addAttachment(file.getFilename(), file);
        }
        mailSender.send(mime);
    }

    public void enviarCodigo(Usuario usuario, String codigo) {
        String cuerpo = """
                Hola,

                Este es tu código de verificación de correo electrónico:

                %s

                Si tú no creaste esta cuenta, puedes ignorar este correo.
                """.formatted(codigo);

        sendText(
                usuario.getEmail(),
                "Confirmación de correo electrónico",
                cuerpo);
    }

    public String generarCodigo() {
        int numero = random.nextInt(1_000_000); // 0 a 999999
        return String.format("%06d", numero);
    }
}
