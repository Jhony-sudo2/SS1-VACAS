package com.example.ss1.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.models.Servicio;
import com.example.ss1.models.EmpleadoR.Area;
import com.example.ss1.services.GeneralService;

@RestController
@RequestMapping("/general")
public class GeneralController {
    @Autowired
    private GeneralService generalService;

    @GetMapping("/areas")
    public List<Area> getAllAreas(){
        return generalService.getAllAreas();
    }

    @GetMapping("/servicios")
    public List<Servicio> getServicios(){
        return generalService.getAllServicios();
    }

    @GetMapping("/area/servicios")
    public List<Servicio> getServiciosAsignados(@RequestParam Long areaId){
        return generalService.getServiciosAsignados(areaId);
    }
}
