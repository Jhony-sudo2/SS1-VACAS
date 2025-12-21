package com.example.ss1.models;

import com.example.ss1.PrimariasCompuestas.ServicioArea;
import com.example.ss1.models.EmpleadoR.Area;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "asignacionservicio")
public class AsignacionServicio {
    @EmbeddedId
    private ServicioArea id;
    @ManyToOne
    @MapsId("servicioId")
    @JoinColumn(name = "servicio_id")
    private Servicio servicio;
    @ManyToOne
    @MapsId("areaId")
    @JoinColumn(name = "area_id")
    private Area area;
    public ServicioArea getId() {
        return id;
    }
    public void setId(ServicioArea id) {
        this.id = id;
    }
    public Servicio getServicio() {
        return servicio;
    }
    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }
    public Area getArea() {
        return area;
    }
    public void setArea(Area area) {
        this.area = area;
    }

    

}
