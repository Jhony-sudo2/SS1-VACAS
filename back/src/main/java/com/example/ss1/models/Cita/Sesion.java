package com.example.ss1.models.Cita;

import java.time.LocalDateTime;

import com.example.ss1.enums.Estado;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "sesiones")
public class Sesion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "historia_id")
    private Historia historia;
    private int numero;
    private LocalDateTime fecha;
    private Estado estado;
    private String justificacion;
    private String temas;
    private String respuestas;
    private String observaciones;
    private boolean estadoPago;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Historia getHistoria() {
        return historia;
    }
    public void setHistoria(Historia historia) {
        this.historia = historia;
    }
    public int getNumero() {
        return numero;
    }
    public void setNumero(int numero) {
        this.numero = numero;
    }
    public LocalDateTime getFecha() {
        return fecha;
    }
    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
    public Estado getEstado() {
        return estado;
    }
    public void setEstado(Estado estado) {
        this.estado = estado;
    }
    public String getJustificacion() {
        return justificacion;
    }
    public void setJustificacion(String justificacion) {
        this.justificacion = justificacion;
    }
    public String getTemas() {
        return temas;
    }
    public void setTemas(String temas) {
        this.temas = temas;
    }
    public String getRespuestas() {
        return respuestas;
    }
    public void setRespuestas(String respuestas) {
        this.respuestas = respuestas;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public boolean isEstadoPago() {
        return estadoPago;
    }
    public void setEstadoPago(boolean estadoPago) {
        this.estadoPago = estadoPago;
    }

    
}
