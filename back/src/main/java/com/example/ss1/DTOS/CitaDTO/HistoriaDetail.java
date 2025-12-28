package com.example.ss1.DTOS.CitaDTO;

import java.util.ArrayList;
import java.util.List;

import com.example.ss1.models.Cita.EstadoInicial;
import com.example.ss1.models.Cita.Historia;
import com.example.ss1.models.Cita.Sesion;
import com.example.ss1.models.PacienteData.Antecedente;
import com.example.ss1.models.PacienteData.HistoriaPersonal;

public class HistoriaDetail {
    private Historia historia;
    private HistoriaPersonal historiaPersonal;
    private EstadoInicial estadoInicial;
    private List<Sesion> sesiones;
    private Antecedente antecedente;
    

    
    public HistoriaPersonal getHistoriaPersonal() {
        return historiaPersonal;
    }

    public void setHistoriaPersonal(HistoriaPersonal historiaPersonal) {
        this.historiaPersonal = historiaPersonal;
    }

    public EstadoInicial getEstadoInicial() {
        return estadoInicial;
    }

    public void setEstadoInicial(EstadoInicial estadoInicial) {
        this.estadoInicial = estadoInicial;
    }

    

    public void setSesiones(ArrayList<Sesion> sesiones) {
        this.sesiones = sesiones;
    }

    public Historia getHistoria() {
        return historia;
    }

    public void setHistoria(Historia historia) {
        this.historia = historia;
    }

    public Antecedente getAntecedente() {
        return antecedente;
    }

    public void setAntecedente(Antecedente antecedente) {
        this.antecedente = antecedente;
    }

    public List<Sesion> getSesiones() {
        return sesiones;
    }

    public void setSesiones(List<Sesion> sesiones) {
        this.sesiones = sesiones;
    }

    
}
