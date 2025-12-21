package com.example.ss1.models;

import java.time.LocalDateTime;

import com.example.ss1.enums.Rol;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Rol rol;

    @Column(nullable = false)
    private String email;

    private boolean a2f;
    private String codigoVerificacion;
    private LocalDateTime codigoVerificacionExpira;
    private boolean emailVerificado;

    private boolean estado;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public boolean isA2f() {
        return a2f;
    }

    public void setA2f(boolean a2f) {
        this.a2f = a2f;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCodigoVerificacion() {
        return codigoVerificacion;
    }

    public void setCodigoVerificacion(String codigoVerificacion) {
        this.codigoVerificacion = codigoVerificacion;
    }

    public LocalDateTime getCodigoVerificacionExpira() {
        return codigoVerificacionExpira;
    }

    public void setCodigoVerificacionExpira(LocalDateTime codigoVerificacionExpira) {
        this.codigoVerificacionExpira = codigoVerificacionExpira;
    }

    public boolean isEmailVerificado() {
        return emailVerificado;
    }

    public void setEmailVerificado(boolean emailVerificado) {
        this.emailVerificado = emailVerificado;
    }

    
}
