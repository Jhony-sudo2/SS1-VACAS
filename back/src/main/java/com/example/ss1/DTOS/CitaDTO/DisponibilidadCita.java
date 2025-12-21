package com.example.ss1.DTOS.CitaDTO;

import java.time.LocalDateTime;
import java.util.List;

public class DisponibilidadCita {
    private Long empleadoId;
    private String nombreEmpleado;
    private List<LocalDateTime> horariosDisponibles;
    
    public DisponibilidadCita() {
    }
    public DisponibilidadCita(Long empleadoId, String nombreEmpleado, List<LocalDateTime> horariosDisponibles) {
        this.empleadoId = empleadoId;
        this.nombreEmpleado = nombreEmpleado;
        this.horariosDisponibles = horariosDisponibles;
    }
    public Long getEmpleadoId() {
        return empleadoId;
    }
    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }
    public String getNombreEmpleado() {
        return nombreEmpleado;
    }
    public void setNombreEmpleado(String nombreEmpleado) {
        this.nombreEmpleado = nombreEmpleado;
    }
    public List<LocalDateTime> getHorariosDisponibles() {
        return horariosDisponibles;
    }
    public void setHorariosDisponibles(List<LocalDateTime> horariosDisponibles) {
        this.horariosDisponibles = horariosDisponibles;
    }
    
}
