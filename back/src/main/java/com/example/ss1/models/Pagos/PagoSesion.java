package com.example.ss1.models.Pagos;

import java.time.LocalDate;

import com.example.ss1.models.Cita.Cita;
import com.example.ss1.models.Cita.Sesion;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class PagoSesion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "sesion_id")
    private Sesion sesion;
    @ManyToOne
    @JoinColumn(name = "cita_id")
    private Cita cita;
    @Column(nullable = false)
    private LocalDate fecha;
    @Column(nullable = false)
    private double total;
    private String tarjeta;
    private String codigo;
    private LocalDate fechaVencimiento;
    
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
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Sesion getSesion() {
        return sesion;
    }
    public void setSesion(Sesion sesion) {
        this.sesion = sesion;
    }
    public Cita getCita() {
        return cita;
    }
    public void setCita(Cita cita) {
        this.cita = cita;
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
    
    

}
