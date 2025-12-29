package com.example.ss1.services;

import java.io.IOException;

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
    @Autowired
    private S3Service s3Service;

    public Area guardarArea(Area data) throws IOException{
        String imagen = s3Service.uploadBase64(data.getImagen(),"area"+data.getNombre());
        data.setImagen(imagen);
        return areaRepo.save(data);
    }

    public Servicio saveServicio(Servicio servicio) throws IOException{
        String imagen = s3Service.uploadBase64(servicio.getImagen(), "servicio_"+servicio.getNombre());
        servicio.setImagen(imagen);
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
