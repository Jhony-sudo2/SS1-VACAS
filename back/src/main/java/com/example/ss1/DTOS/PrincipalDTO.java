package com.example.ss1.DTOS;

import java.util.List;

import com.example.ss1.models.Empresa;
import com.example.ss1.models.Servicio;
import com.example.ss1.models.EmpleadoR.Area;
import com.example.ss1.models.Medicamentos.Medicamento;

public class PrincipalDTO {
    private Empresa empresa;
    private List<Area> areas;
    private List<Servicio> servicios;
    private List<Medicamento> medicamentos;
    
    public PrincipalDTO(Empresa empresa, List<Area> areas, List<Servicio> servicios,List<Medicamento> medicamentos) {
        this.empresa = empresa;
        this.areas = areas;
        this.servicios = servicios;
        this.medicamentos = medicamentos;
    }

    
    public Empresa getEmpresa() {
        return empresa;
    }
    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }
    public List<Area> getAreas() {
        return areas;
    }
    public void setAreas(List<Area> areas) {
        this.areas = areas;
    }
    public List<Servicio> getServicios() {
        return servicios;
    }
    public void setServicios(List<Servicio> servicios) {
        this.servicios = servicios;
    }


    public List<Medicamento> getMedicamentos() {
        return medicamentos;
    }


    public void setMedicamentos(List<Medicamento> medicamentos) {
        this.medicamentos = medicamentos;
    }
    
}
