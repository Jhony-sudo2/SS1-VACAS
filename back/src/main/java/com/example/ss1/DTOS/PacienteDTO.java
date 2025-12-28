package com.example.ss1.DTOS;

import java.time.LocalDate;

public class PacienteDTO {
    private String nombre;
    private boolean genero;
    private boolean estadoCivil;
    private String direccion;
    private String nivelEducativo;
    private String telefono;
    private String personaEmergencia;
    private String telefonoEmergencia;
    private String procedencia;
    private LocalDate fechaNacimiento;
    
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public boolean isGenero() {
        return genero;
    }
    public void setGenero(boolean genero) {
        this.genero = genero;
    }
    public boolean isEstadoCivil() {
        return estadoCivil;
    }
    public void setEstadoCivil(boolean estadoCivil) {
        this.estadoCivil = estadoCivil;
    }
    public String getDireccion() {
        return direccion;
    }
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    public String getNivelEducativo() {
        return nivelEducativo;
    }
    public void setNivelEducativo(String nivelEducativo) {
        this.nivelEducativo = nivelEducativo;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public String getPersonaEmergencia() {
        return personaEmergencia;
    }
    public void setPersonaEmergencia(String personaEmergencia) {
        this.personaEmergencia = personaEmergencia;
    }
    public String getTelefonoEmergencia() {
        return telefonoEmergencia;
    }
    public void setTelefonoEmergencia(String telefonoEmergencia) {
        this.telefonoEmergencia = telefonoEmergencia;
    }
    public String getProcedencia() {
        return procedencia;
    }
    public void setProcedencia(String procedencia) {
        this.procedencia = procedencia;
    }
    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    
}
