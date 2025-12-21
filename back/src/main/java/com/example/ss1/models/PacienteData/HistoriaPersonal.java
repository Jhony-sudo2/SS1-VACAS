package com.example.ss1.models.PacienteData;

import com.example.ss1.enums.Consumo;
import com.example.ss1.models.Cita.Historia;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "historiaspersonales")
public class HistoriaPersonal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String desarrollo;
    private String historiaAcademica;
    private String historiaMedica;
    private String medicacionActual;
    private Consumo alcohol;
    private Consumo tabaco;
    private Consumo drogas;
    private String tratamientosPrevios;
    private String hospitalizaciones;

    @ManyToOne
    @JoinColumn(name = "historia_id")
    private Historia historia;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDesarrollo() {
        return desarrollo;
    }
    public void setDesarrollo(String desarrollo) {
        this.desarrollo = desarrollo;
    }
    public String getHistoriaAcademica() {
        return historiaAcademica;
    }
    public void setHistoriaAcademica(String historiaAcademica) {
        this.historiaAcademica = historiaAcademica;
    }
    public String getHistoriaMedica() {
        return historiaMedica;
    }
    public void setHistoriaMedica(String historiaMedica) {
        this.historiaMedica = historiaMedica;
    }
    public String getMedicacionActual() {
        return medicacionActual;
    }
    public void setMedicacionActual(String medicacionActual) {
        this.medicacionActual = medicacionActual;
    }
    public Consumo getAlcohol() {
        return alcohol;
    }
    public void setAlcohol(Consumo alcohol) {
        this.alcohol = alcohol;
    }
    public Consumo getTabaco() {
        return tabaco;
    }
    public void setTabaco(Consumo tabaco) {
        this.tabaco = tabaco;
    }
    public Consumo getDrogas() {
        return drogas;
    }
    public void setDrogas(Consumo drogas) {
        this.drogas = drogas;
    }
    public String getTratamientosPrevios() {
        return tratamientosPrevios;
    }
    public void setTratamientosPrevios(String tratamientosPrevios) {
        this.tratamientosPrevios = tratamientosPrevios;
    }
    public String getHospitalizaciones() {
        return hospitalizaciones;
    }
    public void setHospitalizaciones(String hospitalizaciones) {
        this.hospitalizaciones = hospitalizaciones;
    }

    

}
