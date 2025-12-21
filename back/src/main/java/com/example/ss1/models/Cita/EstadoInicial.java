package com.example.ss1.models.Cita;

import com.example.ss1.enums.EstadoEmocion;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "estadosiniciales")
public class EstadoInicial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "historia_id")
    private Historia historia;
    private EstadoEmocion animmo;
    private EstadoEmocion ansiedad;
    private EstadoEmocion funcionamientosocial;
    private EstadoEmocion suenio;
    private EstadoEmocion apetito;
    private String observaciones;

    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public EstadoEmocion getAnimmo() {
        return animmo;
    }
    public void setAnimmo(EstadoEmocion animmo) {
        this.animmo = animmo;
    }
    public EstadoEmocion getAnsiedad() {
        return ansiedad;
    }
    public void setAnsiedad(EstadoEmocion ansiedad) {
        this.ansiedad = ansiedad;
    }
    public EstadoEmocion getFuncionamientosocial() {
        return funcionamientosocial;
    }
    public void setFuncionamientosocial(EstadoEmocion funcionamientosocial) {
        this.funcionamientosocial = funcionamientosocial;
    }
    public EstadoEmocion getSuenio() {
        return suenio;
    }
    public void setSuenio(EstadoEmocion suenio) {
        this.suenio = suenio;
    }
    public EstadoEmocion getApetito() {
        return apetito;
    }
    public void setApetito(EstadoEmocion apetito) {
        this.apetito = apetito;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public Historia getHistoria() {
        return historia;
    }
    public void setHistoria(Historia historia) {
        this.historia = historia;
    }

    
    
}
