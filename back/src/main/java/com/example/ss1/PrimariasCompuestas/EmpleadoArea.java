package com.example.ss1.PrimariasCompuestas;

import java.io.Serializable;
import java.util.Objects;

public class EmpleadoArea implements Serializable {
    private Long empleadoId;
    private Long areaId;

    public EmpleadoArea() {
    }

    public EmpleadoArea(Long empleadoId, Long areaId) {
        this.empleadoId = empleadoId;
        this.areaId = areaId;
    }

    public Long getEmpleadoId() {
        return empleadoId;
    }

    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
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
        if (!(o instanceof EmpleadoArea))
            return false;
        EmpleadoArea that = (EmpleadoArea) o;
        return Objects.equals(empleadoId, that.empleadoId) &&
                Objects.equals(areaId, that.areaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(empleadoId, areaId);
    }
}
