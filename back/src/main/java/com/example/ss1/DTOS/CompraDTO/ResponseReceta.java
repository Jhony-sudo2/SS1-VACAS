package com.example.ss1.DTOS.CompraDTO;

import com.example.ss1.models.Medicamentos.Medicamento;

public class ResponseReceta {
    private Medicamento medicamento;
    private int cantidad;
    public Medicamento getMedicamento() {
        return medicamento;
    }
    public void setMedicamento(Medicamento medicamento) {
        this.medicamento = medicamento;
    }
    public int getCantidad() {
        return cantidad;
    }
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
    
}
