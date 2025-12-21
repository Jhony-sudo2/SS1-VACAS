package com.example.ss1.models.PacienteData;

import com.example.ss1.models.Paciente;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "antecedentes")
public class Antecedente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String estructura;
    private String trastornos;
    private String eventos;
    @OneToOne
    @JoinColumn(name ="paciente_id")
    private Paciente paciente;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getEstructura() {
        return estructura;
    }
    public void setEstructura(String estructura) {
        this.estructura = estructura;
    }
    public String getTrastornos() {
        return trastornos;
    }
    public void setTrastornos(String trastornos) {
        this.trastornos = trastornos;
    }
    public String getEventos() {
        return eventos;
    }
    public void setEventos(String eventos) {
        this.eventos = eventos;
    }
    public Paciente getPaciente() {
        return paciente;
    }
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    
    
}
