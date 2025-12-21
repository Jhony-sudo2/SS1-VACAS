package com.example.ss1.models.Horario;

import java.time.LocalTime;

import com.example.ss1.models.Empleado;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "horarios")
public class Horario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;    
    @Column(nullable = false)
    private int dia;
    @Column(nullable = false)
    private LocalTime horaEntrada;
    @Column(nullable = false)
    private LocalTime horaSalida;
    @Column(nullable = false)
    private boolean trabaja;
    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public int getDia() {
        return dia;
    }
    public void setDia(int dia) {
        this.dia = dia;
    }
    public LocalTime getHoraEntrada() {
        return horaEntrada;
    }
    public void setHoraEntrada(LocalTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }
    public LocalTime getHoraSalida() {
        return horaSalida;
    }
    public void setHoraSalida(LocalTime horaSalida) {
        this.horaSalida = horaSalida;
    }
    public Empleado getEmpleado() {
        return empleado;
    }
    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
    public boolean isTrabaja() {
        return trabaja;
    }
    public void setTrabaja(boolean trabaja) {
        this.trabaja = trabaja;
    }

    
}
