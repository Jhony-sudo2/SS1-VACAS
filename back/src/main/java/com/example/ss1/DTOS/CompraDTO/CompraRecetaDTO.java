package com.example.ss1.DTOS.CompraDTO;

import java.time.LocalDate;
import java.util.List;

public class CompraRecetaDTO {
    private List<Long> recetasId;
    private String tarjeta;
    private String codigo;
    private LocalDate fechaVencimiento;
    private boolean tipo;
    public List<Long> getRecetasId() {
        return recetasId;
    }
    public void setRecetasId(List<Long> recetasId) {
        this.recetasId = recetasId;
    }
    public String getTarjeta() {
        return tarjeta;
    }
    public void setTarjeta(String tarjeta) {
        this.tarjeta = tarjeta;
    }
    public String getCodigo() {
        return codigo;
    }
    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    public boolean isTipo() {
        return tipo;
    }
    public void setTipo(boolean tipo) {
        this.tipo = tipo;
    }
    
}
