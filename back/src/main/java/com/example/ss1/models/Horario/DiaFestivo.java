package com.example.ss1.models.Horario;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "diafestivo")
public class DiaFestivo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer mes;
    private Integer dia;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Integer getMes() {
        return mes;
    }
    public void setMes(Integer mes) {
        this.mes = mes;
    }
    public Integer getDia() {
        return dia;
    }
    public void setDia(Integer dia) {
        this.dia = dia;
    }

    
}
