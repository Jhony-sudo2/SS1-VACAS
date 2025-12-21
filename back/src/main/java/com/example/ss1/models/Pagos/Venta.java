package com.example.ss1.models.Pagos;

import java.time.LocalDate;

import com.example.ss1.models.Paciente;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ventas")
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;
    private boolean total;
    private LocalDate fecha;
    private boolean estadoEntrega;
    private String direccionEntrega;

    
    public boolean isEstadoEntrega() {
        return estadoEntrega;
    }
    public void setEstadoEntrega(boolean estadoEntrega) {
        this.estadoEntrega = estadoEntrega;
    }
    public String getDireccionEntrega() {
        return direccionEntrega;
    }
    public void setDireccionEntrega(String direccionEntrega) {
        this.direccionEntrega = direccionEntrega;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Paciente getPaciente() {
        return paciente;
    }
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
    public boolean isTotal() {
        return total;
    }
    public void setTotal(boolean total) {
        this.total = total;
    }
    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    


}
