package com.example.ss1.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.ss1.errors.ApiException;
import com.example.ss1.models.AsignacionServicio;
import com.example.ss1.models.Servicio;
import com.example.ss1.models.EmpleadoR.Area;
import com.example.ss1.repositories.AreaRepo;
import com.example.ss1.repositories.AsignacionServicioRepo;
import com.example.ss1.repositories.ServicioRepo;

@Service
public class GeneralService {
    @Autowired
    private AreaRepo areaRepo;
    @Autowired
    private ServicioRepo servicioRepo;
    @Autowired
    private AsignacionServicioRepo asignacionServicioRepo;

    public List<Area> getAllAreas(){
        return areaRepo.findAll();
    }

    public List<Servicio> getAllServicios(){
        return servicioRepo.findAll();
    }

    public List<Servicio> getServiciosAsignados(Long areaId){
        areaRepo.findById(areaId)
        .orElseThrow(()-> new ApiException("Servicio no encontrado", HttpStatus.NOT_FOUND));
        return asignacionServicioRepo.findAllByAreaId(areaId).stream()
        .map(AsignacionServicio::getServicio)
        .distinct()
        .toList();
    }
}
