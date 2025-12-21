package com.example.ss1.DTOS;

import java.util.ArrayList;

import com.example.ss1.models.Horario.Descanso;
import com.example.ss1.models.Horario.Horario;

public class AsignacionHorarioDTO {
    private Long empleadoId;
    private Horario horario;
    private ArrayList<Descanso> descansos;
    public Long getEmpleadoId() {
        return empleadoId;
    }
    public void setEmpleadoId(long empleadoId) {
        this.empleadoId = empleadoId;
    }
    public ArrayList<Descanso> getDescansos() {
        return descansos;
    }
    public void setDescansos(ArrayList<Descanso> descansos) {
        this.descansos = descansos;
    }
    public Horario getHorario() {
        return horario;
    }
    public void setHorario(Horario horario) {
        this.horario = horario;
    }
    
    
}
