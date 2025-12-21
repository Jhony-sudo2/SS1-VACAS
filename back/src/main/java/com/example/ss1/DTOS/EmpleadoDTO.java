package com.example.ss1.DTOS;

import java.time.LocalDate;

public class EmpleadoDTO {
    private String nombre;
    private LocalDate fechaNacimiento;
    private boolean genero;
    private boolean estadoCivil;
    private String telefono;
    private String colegiado;
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    public boolean isGenero() {
        return genero;
    }
    public void setGenero(boolean genero) {
        this.genero = genero;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public String getColegiado() {
        return colegiado;
    }
    public void setColegiado(String colegiado) {
        this.colegiado = colegiado;
    }
    public boolean isEstadoCivil() {
        return estadoCivil;
    }
    public void setEstadoCivil(boolean estadoCivil) {
        this.estadoCivil = estadoCivil;
    }
    
    
}
