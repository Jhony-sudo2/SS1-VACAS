package com.example.ss1.DTOS.CitaDTO;

import com.example.ss1.models.Cita.EstadoInicial;
import com.example.ss1.models.PacienteData.Antecedente;
import com.example.ss1.models.PacienteData.HistoriaPersonal;

public class HistoriaCompleta {
    private HistoriaCreate historiaCreate;
    private HistoriaPersonal personal;
    private Antecedente antecedente;
    private EstadoInicial estadoInicial;
    public HistoriaCreate getHistoriaCreate() {
        return historiaCreate;
    }
    public void setHistoriaCreate(HistoriaCreate historiaCreate) {
        this.historiaCreate = historiaCreate;
    }
    public HistoriaPersonal getPersonal() {
        return personal;
    }
    public void setPersonal(HistoriaPersonal personal) {
        this.personal = personal;
    }
    public Antecedente getAntecedente() {
        return antecedente;
    }
    public void setAntecedente(Antecedente antecedente) {
        this.antecedente = antecedente;
    }
    public EstadoInicial getEstadoInicial() {
        return estadoInicial;
    }
    public void setEstadoInicial(EstadoInicial estadoInicial) {
        this.estadoInicial = estadoInicial;
    }

    
}
