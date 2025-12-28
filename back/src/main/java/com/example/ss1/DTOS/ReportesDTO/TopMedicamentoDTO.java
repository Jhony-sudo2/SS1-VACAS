package com.example.ss1.DTOS.ReportesDTO;

public class TopMedicamentoDTO {
    public Long medicamentoId;
    public String nombre;
    public Long cantidad;

    public TopMedicamentoDTO(Long medicamentoId, String nombre, Long cantidad) {
        this.medicamentoId = medicamentoId;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}