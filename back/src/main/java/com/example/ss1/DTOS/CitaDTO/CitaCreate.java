package com.example.ss1.DTOS.CitaDTO;

import java.time.LocalDateTime;

public class CitaCreate {
    private Long pacienteId;
    private Long servicioId;
    private Long empleadoId;
    private LocalDateTime fecha;
    public Long getPacienteId() {
        return pacienteId;
    }

    
    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }
    public Long getServicioId() {
        return servicioId;
    }
    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }
    public LocalDateTime getFecha() {
        return fecha;
    }
    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }


    public Long getEmpleadoId() {
        return empleadoId;
    }


    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }

    
}
