package com.example.ss1.DTOS.CitaDTO;

import java.time.LocalDate;

import com.example.ss1.enums.ConfigTratamiento.Enfoque;
import com.example.ss1.enums.ConfigTratamiento.Frecuencia;
import com.example.ss1.enums.ConfigTratamiento.Modalidad;


public class HistoriaCreate {
    private Long empleadoId;
    private Long pacienteId;
    private LocalDate fechaApertura;
    private String motivoConsulta;
    private String procedencia;
    //CONFIGURACION DEL TRATAMIENTO
    private Modalidad modalidad;
    private Enfoque enfoque;
    private Frecuencia frecuencia;
    private int sesiones;
    private int duracion;
    private double costoSesion;

    public Long getEmpleadoId() {
        return empleadoId;
    }
    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }
    public Long getPacienteId() {
        return pacienteId;
    }
    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
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
    public double getCostoSesion() {
        return costoSesion;
    }
    public void setCostoSesion(double costoSesion) {
        this.costoSesion = costoSesion;
    }
    

    


}
