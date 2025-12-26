package com.example.ss1.DTOS.CitaDTO;

import java.util.List;

import com.example.ss1.models.Cita.ImpresionDiagnostica;
import com.example.ss1.models.Cita.PruebasAplicadas;
import com.example.ss1.models.Cita.Sesion;

public class SesionDetail {
    private Sesion sesion;
    private List<PruebasAplicadas> pruebasAplicadas;
    private ImpresionDiagnostica impresionDiagnostica;
    
    public SesionDetail() {
    }
    

    public SesionDetail(Sesion sesion, List<PruebasAplicadas> pruebasAplicadas,
            ImpresionDiagnostica impresionDiagnostica) {
        this.sesion = sesion;
        this.pruebasAplicadas = pruebasAplicadas;
        this.impresionDiagnostica = impresionDiagnostica;
    }


    public Sesion getSesion() {
        return sesion;
    }

    public void setSesion(Sesion sesion) {
        this.sesion = sesion;
    }

    public List<PruebasAplicadas> getPruebasAplicadas() {
        return pruebasAplicadas;
    }

    public void setPruebasAplicadas(List<PruebasAplicadas> pruebasAplicadas) {
        this.pruebasAplicadas = pruebasAplicadas;
    }

    public ImpresionDiagnostica getImpresionDiagnostica() {
        return impresionDiagnostica;
    }

    public void setImpresionDiagnostica(ImpresionDiagnostica impresionDiagnostica) {
        this.impresionDiagnostica = impresionDiagnostica;
    }
    
    
    
}
