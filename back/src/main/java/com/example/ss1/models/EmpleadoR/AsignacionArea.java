package com.example.ss1.models.EmpleadoR;



import com.example.ss1.PrimariasCompuestas.EmpleadoArea;
import com.example.ss1.models.Empleado;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "asignacionarea")
public class AsignacionArea {
    @EmbeddedId
    private EmpleadoArea id;

    @ManyToOne
    @MapsId("empleadoId")
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;
    @ManyToOne
    @MapsId("areaId")
    @JoinColumn(name = "area_id")
    private Area area;
    public EmpleadoArea getId() {
        return id;
    }
    public void setId(EmpleadoArea id) {
        this.id = id;
    }
    public Empleado getEmpleado() {
        return empleado;
    }
    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
    public Area getArea() {
        return area;
    }
    public void setArea(Area area) {
        this.area = area;
    }

    

}
