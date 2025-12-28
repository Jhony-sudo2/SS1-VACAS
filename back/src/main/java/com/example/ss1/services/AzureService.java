package com.example.ss1.services;

import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.storage.blob.*;
import com.azure.storage.blob.models.BlobHttpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Base64;
import java.util.UUID;

@Service
public class AzureService {
    private final BlobContainerClient container;

    public AzureService(
            @Value("${azure.storage.connection-string:}") String connStr,
            @Value("${azure.storage.account-url:}") String accountUrl,
            @Value("${azure.storage.container-name}") String containerName) {
        BlobServiceClient serviceClient;

        if (connStr != null && !connStr.isBlank()) {
            serviceClient = new BlobServiceClientBuilder()
                    .connectionString(connStr)
                    .buildClient();
        } else {
            serviceClient = new BlobServiceClientBuilder()
                    .endpoint(accountUrl) // https://<account>.blob.core.windows.net
                    .credential(new DefaultAzureCredentialBuilder().build())
                    .buildClient();
        }

        this.container = serviceClient.getBlobContainerClient(containerName);
        this.container.createIfNotExists();
    }

    public String upload(MultipartFile file) throws Exception {
        String blobName = UUID.randomUUID() + "-"
                + (file.getOriginalFilename() == null ? "imagen" : file.getOriginalFilename());
        BlobClient blob = container.getBlobClient(blobName);

        try (InputStream in = file.getInputStream()) {
            blob.upload(in, file.getSize(), true); // overwrite = true
        }

        String ct = (file.getContentType() == null) ? "application/octet-stream" : file.getContentType();
        blob.setHttpHeaders(new BlobHttpHeaders().setContentType(ct));

        return blob.getBlobUrl(); // si el container es privado, esta URL no será pública sin SAS
    }

    public String uploadBase64(String base64Input, String fileName, String mimeTypeInput) {
        if (base64Input == null || base64Input.isBlank()) {
            throw new IllegalArgumentException("base64 vacío");
        }

        String base64 = base64Input.trim();
        String mimeType = mimeTypeInput;

        // Soporta: data:image/png;base64,AAAA...
        if (base64.startsWith("data:")) {
            int comma = base64.indexOf(',');
            if (comma < 0)
                throw new IllegalArgumentException("data-uri inválido");
            String meta = base64.substring(5, comma); // "image/png;base64"
            base64 = base64.substring(comma + 1);
            String[] parts = meta.split(";");
            if (parts.length > 0)
                mimeType = parts[0];
        }

        // Limpia espacios/saltos de línea por si viene formateado
        base64 = base64.replaceAll("\\s+", "");

        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(base64);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("base64 inválido (no se puede decodificar)");
        }

        String ext = extensionFrom(mimeType, fileName);
        String blobName = UUID.randomUUID() + ext;

        BlobClient blob = container.getBlobClient(blobName);

        blob.upload(new ByteArrayInputStream(bytes), bytes.length, true);

        String ct = (mimeType != null && !mimeType.isBlank()) ? mimeType : "application/octet-stream";
        blob.setHttpHeaders(new BlobHttpHeaders().setContentType(ct));

        // Path final (URL del blob)
        return blob.getBlobUrl();
    }

    private String extensionFrom(String mimeType, String fileName) {
        // si viene filename con extensión, úsala
        if (fileName != null) {
            String fn = fileName.trim();
            int dot = fn.lastIndexOf('.');
            if (dot > -1 && dot < fn.length() - 1) {
                return fn.substring(dot).toLowerCase();
            }
        }

        if (mimeType == null)
            return ".bin";
        return switch (mimeType.toLowerCase()) {
            case "image/png" -> ".png";
            case "image/jpeg", "image/jpg" -> ".jpg";
            case "image/webp" -> ".webp";
            default -> ".bin";
        };
    }
}
