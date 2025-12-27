package com.example.ss1.models.Pagos;

import java.time.LocalDate;
import java.time.YearMonth;

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
    private double total;
    private LocalDate fecha;
    private boolean estadoEntrega;
    private String tarjeta;
    private String codigo;
    private YearMonth fechaVencimiento;
    
    
    public String getTarjeta() {
        return tarjeta;
    }
    public void setTarjeta(String tarjeta) {
        this.tarjeta = tarjeta;
    }
    public String getCodigo() {
        return codigo;
    }
    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
    
    public boolean isEstadoEntrega() {
        return estadoEntrega;
    }
    public void setEstadoEntrega(boolean estadoEntrega) {
        this.estadoEntrega = estadoEntrega;
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
    
    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
    public double getTotal() {
        return total;
    }
    public void setTotal(double total) {
        this.total = total;
    }
    public YearMonth getFechaVencimiento() {
        return fechaVencimiento;
    }
    public void setFechaVencimiento(YearMonth fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    


}
