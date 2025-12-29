package com.example.ss1.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region; 

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadBase64(String base64Input, String fileName) throws IOException {

        Base64Parsed parsed = parseBase64(base64Input);

        String contentType = parsed.contentType;
        if ("application/octet-stream".equals(contentType)) {
            String probed = Files.probeContentType(Paths.get(fileName));
            if (probed != null)
                contentType = probed;
        }

        String key = "Fotos/" + fileName;

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(contentType)
                        .build(),
                RequestBody.fromBytes(parsed.bytes));

        // URL pública (virtual-hosted-style). Incluye region para que no falle fuera de
        // us-east-1.
        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
    }

    private static class Base64Parsed {
        final byte[] bytes;
        final String contentType;

        Base64Parsed(byte[] bytes, String contentType) {
            this.bytes = bytes;
            this.contentType = contentType;
        }
    }

    private Base64Parsed parseBase64(String input) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException("Base64 vacío");
        }

        String s = input.trim();
        String contentType = "application/octet-stream";

        // data:image/png;base64,AAAA...
        if (s.startsWith("data:")) {
            int comma = s.indexOf(',');
            if (comma < 0)
                throw new IllegalArgumentException("Data URL inválida (sin coma)");
            String header = s.substring(0, comma); // data:image/png;base64
            s = s.substring(comma + 1);

            int semi = header.indexOf(';');
            if (semi > 5) {
                contentType = header.substring(5, semi); // image/png
            }
        }

        // Limpieza
        s = s.replace("\n", "").replace("\r", "").trim();
        // Si viene por form-urlencoded, espacios deberían ser '+'
        s = s.replace(" ", "+");
        // URL-safe base64
        s = s.replace('-', '+').replace('_', '/');
        // padding
        int mod = s.length() % 4;
        if (mod != 0)
            s = s + "====".substring(mod);

        byte[] bytes = Base64.getMimeDecoder().decode(s);
        return new Base64Parsed(bytes, contentType);
    }
}