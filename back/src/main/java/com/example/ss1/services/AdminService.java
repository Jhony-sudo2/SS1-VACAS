package com.example.ss1.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.ss1.DTOS.Servicio.AsignarServicio;
import com.example.ss1.PrimariasCompuestas.ServicioArea;
import com.example.ss1.errors.ApiException;
import com.example.ss1.models.AsignacionServicio;
import com.example.ss1.models.Servicio;
import com.example.ss1.models.EmpleadoR.Area;
import com.example.ss1.repositories.AreaRepo;
import com.example.ss1.repositories.AsignacionServicioRepo;
import com.example.ss1.repositories.ServicioRepo;

@Service
public class AdminService {
    @Autowired
    private AreaRepo areaRepo;
    @Autowired
    private ServicioRepo servicioRepo;
    @Autowired
    private AsignacionServicioRepo asignacionServicioRepo;

    public Area guardarArea(String nombre){
        Area area = new Area();
        area.setNombre(nombre);
        return areaRepo.save(area);
    }

    public Servicio saveServicio(Servicio servicio){
        return servicioRepo.save(servicio);
    }

    public void AsignarServicios(AsignarServicio data){
        Area area = areaRepo.findById(data.getAreaId())
        .orElseThrow(()-> new ApiException("Area no encontrada", HttpStatus.NOT_FOUND));
        for (Long tmpLong : data.getServicios()) {
            Servicio servicio = servicioRepo.findById(tmpLong)
            .orElseThrow(()-> new ApiException("Servicio no encontrado", HttpStatus.NOT_FOUND));
            AsignacionServicio nuevo = new AsignacionServicio();
            nuevo.setArea(area);
            nuevo.setServicio(servicio);
            nuevo.setId(new ServicioArea(servicio.getId(), area.getId()));
            asignacionServicioRepo.save(nuevo);
        }
    }

}
