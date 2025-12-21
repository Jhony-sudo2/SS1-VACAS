package com.example.ss1.models.Horario;

import java.time.LocalTime;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "descansos")
public class Descanso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "horario_id")
    private Horario horario;
    private LocalTime inicio;
    private LocalTime fin;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Horario getHorario() {
        return horario;
    }
    public void setHorario(Horario horario) {
        this.horario = horario;
    }
    public LocalTime getInicio() {
        return inicio;
    }
    public void setInicio(LocalTime inicio) {
        this.inicio = inicio;
    }
    public LocalTime getFin() {
        return fin;
    }
    public void setFin(LocalTime fin) {
        this.fin = fin;
    }

    
}
