package com.example.ss1.DTOS.ReportesDTO;

public class ReporteFinancieroDTO {
    public double ingresosVentas;
    public double ingresosSesiones;
    public double ingresosTotales;

    public double costoNominaEstimado; // base con sueldos (sin bonos/retenciones)
    public double gananciaEstimada;    // ingresosTotales - costoNominaEstimado

    public ReporteFinancieroDTO(double ingresosVentas, double ingresosSesiones, double costoNominaEstimado) {
        this.ingresosVentas = ingresosVentas;
        this.ingresosSesiones = ingresosSesiones;
        this.ingresosTotales = ingresosVentas + ingresosSesiones;
        this.costoNominaEstimado = costoNominaEstimado;
        this.gananciaEstimada = this.ingresosTotales - this.costoNominaEstimado;
    }
}