package com.example.ss1.PrimariasCompuestas;

import java.io.Serializable;
import java.util.Objects;

public class ServicioArea implements Serializable{
    private Long servicioId;
    private Long areaId;

    
    public ServicioArea() {
    }

    public ServicioArea(Long servicioId, Long areaId) {
        this.servicioId = servicioId;
        this.areaId = areaId;
    }

    public Long getServicioId() {
        return servicioId;
    }

    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof ServicioArea))
            return false;
        ServicioArea that = (ServicioArea) o;
        return Objects.equals(servicioId, that.servicioId) &&
                Objects.equals(areaId, that.areaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(servicioId, areaId);
    }
    
    
}
