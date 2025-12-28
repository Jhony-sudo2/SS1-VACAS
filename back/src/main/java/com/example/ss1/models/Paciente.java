package com.example.ss1.models;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Pacientes")
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Paciente(){
        
    }
    public Paciente(String nombre, boolean genero, boolean estadoCivil, String direccion, String nivelEducativo,
            String telefono, String personaEmergencia, String telefonoEmergencia, String procedencia, Usuario usuario,LocalDate fechaNacimiento) {
        this.nombre = nombre;
        this.genero = genero;
        this.estadoCivil = estadoCivil;
        this.direccion = direccion;
        this.nivelEducativo = nivelEducativo;
        this.telefono = telefono;
        this.personaEmergencia = personaEmergencia;
        this.telefonoEmergencia = telefonoEmergencia;
        this.procedencia = procedencia;
        this.usuario = usuario;
        this.fechaNacimiento = fechaNacimiento;
    }
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
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
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    
}
