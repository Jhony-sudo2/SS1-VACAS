package com.example.ss1.DTOS.Servicio;

public class AsignarServicio {
    private Long areaId;
    private Long[] servicios;
    public Long getAreaId() {
        return areaId;
    }
    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }
    public Long[] getServicios() {
        return servicios;
    }
    public void setServicios(Long[] servicios) {
        this.servicios = servicios;
    }

    
}
