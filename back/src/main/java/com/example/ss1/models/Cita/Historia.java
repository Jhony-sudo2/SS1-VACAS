package com.example.ss1.models.Cita;

import java.time.LocalDate;

import com.example.ss1.enums.EstadoHistoria;
import com.example.ss1.enums.ConfigTratamiento.Enfoque;
import com.example.ss1.enums.ConfigTratamiento.Frecuencia;
import com.example.ss1.enums.ConfigTratamiento.Modalidad;
import com.example.ss1.models.Empleado;
import com.example.ss1.models.Paciente;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "historias")
public class Historia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;
    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;
    private LocalDate fechaApertura;
    private String motivoConsulta;
    private String procedencia;
    private EstadoHistoria estado;
    private String motivoAlta;
    //CONFIGURACION DEL TRATAMIENTO
    private Modalidad modalidad;
    private Enfoque enfoque;
    private Frecuencia frecuencia;
    private int sesiones;
    private int duracion;
    private double costoSesion;


    
    

    public Modalidad getModalidad() {
        return modalidad;
    }
    public void setModalidad(Modalidad modalidad) {
        this.modalidad = modalidad;
    }
    public Enfoque getEnfoque() {
        return enfoque;
    }
    public void setEnfoque(Enfoque enfoque) {
        this.enfoque = enfoque;
    }
    public Frecuencia getFrecuencia() {
        return frecuencia;
    }
    public void setFrecuencia(Frecuencia frecuencia) {
        this.frecuencia = frecuencia;
    }
    public int getSesiones() {
        return sesiones;
    }
    public void setSesiones(int sesiones) {
        this.sesiones = sesiones;
    }
    public int getDuracion() {
        return duracion;
    }
    public void setDuracion(int duracion) {
        this.duracion = duracion;
    }
    
    public EstadoHistoria getEstado() {
        return estado;
    }
    public void setEstado(EstadoHistoria estado) {
        this.estado = estado;
    }
    public String getMotivoAlta() {
        return motivoAlta;
    }
    public void setMotivoAlta(String motivoAlta) {
        this.motivoAlta = motivoAlta;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Empleado getEmpleado() {
        return empleado;
    }
    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
    public Paciente getPaciente() {
        return paciente;
    }
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
    public LocalDate getFechaApertura() {
        return fechaApertura;
    }
    public void setFechaApertura(LocalDate fechaApertura) {
        this.fechaApertura = fechaApertura;
    }
    public String getMotivoConsulta() {
        return motivoConsulta;
    }
    public void setMotivoConsulta(String motivoConsulta) {
        this.motivoConsulta = motivoConsulta;
    }
    public String getProcedencia() {
        return procedencia;
    }
    public void setProcedencia(String procedencia) {
        this.procedencia = procedencia;
    }
    public double getCostoSesion() {
        return costoSesion;
    }
    public void setCostoSesion(double costoSesion) {
        this.costoSesion = costoSesion;
    }

    
}
