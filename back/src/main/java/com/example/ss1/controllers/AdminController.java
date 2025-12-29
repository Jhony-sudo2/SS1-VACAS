package com.example.ss1.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.Servicio.AsignarServicio;
import com.example.ss1.models.Servicio;
import com.example.ss1.models.EmpleadoR.Area;
import com.example.ss1.services.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PostMapping("/area")
    public Area saveArea(@RequestBody Area area) throws IOException{
        return adminService.guardarArea(area);
    }

    @PostMapping("/servicio")
    public Servicio saveServicio(@RequestBody Servicio servicio) throws IOException{
        return adminService.saveServicio(servicio);
    }

    @PostMapping("/servicios/asignar")
    public void asignarServicios(@RequestBody AsignarServicio asignacion){
         adminService.AsignarServicios(asignacion);   
    }


    
}
