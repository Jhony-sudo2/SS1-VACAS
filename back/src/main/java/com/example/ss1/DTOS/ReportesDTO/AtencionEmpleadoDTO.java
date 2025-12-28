package com.example.ss1.DTOS.ReportesDTO;

public class AtencionEmpleadoDTO {
    public Long empleadoId;
    public String empleadoNombre;
    public Long sesionesPagadas;
    public Double totalRecaudado;

    public AtencionEmpleadoDTO(Long empleadoId, String empleadoNombre, Long sesionesPagadas, Double totalRecaudado) {
        this.empleadoId = empleadoId;
        this.empleadoNombre = empleadoNombre;
        this.sesionesPagadas = sesionesPagadas;
        this.totalRecaudado = totalRecaudado;
    }
}
