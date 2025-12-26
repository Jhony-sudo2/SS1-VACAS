package com.example.ss1.DTOS.CompraDTO;

import java.time.LocalDate;

public class CompraDTO {
    private Detalle[] detalle;
    private Long pacienteId;
    private boolean tipo;
    private String tarjeta;
    private String codigo;
    private LocalDate fechaVencimiento;

    

    public boolean isTipo() {
        return tipo;
    }

    public void setTipo(boolean tipo) {
        this.tipo = tipo;
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

    public Detalle[] getDetalle() {
        return detalle;
    }

    public void setDetalle(Detalle[] detalle) {
        this.detalle = detalle;
    }

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public class Detalle{
        private Long medicamentoId;
        private int cantidad;
        public Long getMedicamentoId() {
            return medicamentoId;
        }
        public void setMedicamentoId(Long medicamentoId) {
            this.medicamentoId = medicamentoId;
        }
        public int getCantidad() {
            return cantidad;
        }
        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }
        
    }

}

