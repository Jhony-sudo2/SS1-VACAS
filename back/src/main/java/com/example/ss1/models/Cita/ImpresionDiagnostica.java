package com.example.ss1.models.Cita;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "impresiondiagnostica")
public class ImpresionDiagnostica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "sesion_id")
    private Sesion sesion;
    private String descripcion;
    private String factoresPredisponentes;
    private String factoresPrecipitantes;
    private String factoresMantenedores;
    private String nivelFuncionamiento;
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
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public String getFactoresPredisponentes() {
        return factoresPredisponentes;
    }
    public void setFactoresPredisponentes(String factoresPredisponentes) {
        this.factoresPredisponentes = factoresPredisponentes;
    }
    public String getFactoresPrecipitantes() {
        return factoresPrecipitantes;
    }
    public void setFactoresPrecipitantes(String factoresPrecipitantes) {
        this.factoresPrecipitantes = factoresPrecipitantes;
    }
    public String getFactoresMantenedores() {
        return factoresMantenedores;
    }
    public void setFactoresMantenedores(String factoresMantenedores) {
        this.factoresMantenedores = factoresMantenedores;
    }
    public String getNivelFuncionamiento() {
        return nivelFuncionamiento;
    }
    public void setNivelFuncionamiento(String nivelFuncionamiento) {
        this.nivelFuncionamiento = nivelFuncionamiento;
    }
    
}
