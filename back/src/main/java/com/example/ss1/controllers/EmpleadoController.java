package com.example.ss1.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.AsignacionAreaDTO;
import com.example.ss1.DTOS.AsignacionHorarioDTO;
import com.example.ss1.models.Empleado;
import com.example.ss1.models.EmpleadoR.Area;
import com.example.ss1.services.EmpleadoService;


@RestController
@RequestMapping("/empleado")
public class EmpleadoController {
    @Autowired
    private EmpleadoService empleadoService;

    @PostMapping("/asignarHorario")
    public void asignarHorario(@RequestBody ArrayList<AsignacionHorarioDTO> asignacionHorarioDTO){
        empleadoService.asignarHorario(asignacionHorarioDTO);
    }   
    
    @GetMapping("/id")
    public Empleado findById(@RequestParam Long id){
        return empleadoService.findEmpleadoById(id);
    }

    @GetMapping("/horario")
    public ArrayList<AsignacionHorarioDTO> getHorarios(@RequestParam Long id){
        return empleadoService.getHorariosByEmpleadoId(id);
    }

    @GetMapping("/areas")
    public List<Area> getAreas(@RequestParam Long id){
        return empleadoService.getAreasByEmpleadoId(id);
    }

    @PostMapping("/asignarArea")
    public void asignarArea(@RequestBody AsignacionAreaDTO data){
        empleadoService.asignarArea(data.getIdEmpleado(), data.getAreas());
    }

    
    

    @GetMapping()
    public List<Empleado> getAllEmpleados(){
        return empleadoService.findAllEmpleados();
    }
}
