package com.example.ss1.models.Pagos;

import com.example.ss1.models.Medicamentos.Medicamento;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "detalleventa")
public class DetalleVenta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "factura_id")
    private DetalleVenta factura;
    @ManyToOne
    @JoinColumn(name = "medicamento_id")
    private Medicamento medicamento;
    private int cantidad;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public DetalleVenta getFactura() {
        return factura;
    }
    public void setFactura(DetalleVenta factura) {
        this.factura = factura;
    }
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
