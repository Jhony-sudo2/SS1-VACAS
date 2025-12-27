package com.example.ss1.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.CitaDTO.CitaCreate;
import com.example.ss1.DTOS.CitaDTO.DisponibilidadCita;
import com.example.ss1.DTOS.CitaDTO.UpdateState;
import com.example.ss1.models.Cita.Cita;
import com.example.ss1.services.CitaService;

@RestController
@RequestMapping("/cita")
public class CitaController {
    @Autowired
    private CitaService citaService;

    @GetMapping("/disponibilidad")
    public List<DisponibilidadCita> getDisponibles(@RequestParam Long idServicio,@RequestParam LocalDate fecha){
        return citaService.getPosibles(idServicio, fecha);
    }

    @PostMapping("/agendar")
    public void agendar(@RequestBody CitaCreate crear){
        citaService.agendar(crear);
    }

    @PostMapping("/update")
    public void updateState(@RequestBody UpdateState data){
        citaService.updateState(data);
    }

    @GetMapping("/empleado")
    public List<Cita> getMyCitas(@RequestParam Long id){
        return citaService.findCitaByEmpleadoId(id);
    }

    
    @GetMapping("/paciente")
    public List<Cita> getMyCitasPaciente(@RequestParam Long id){
        return citaService.findCitaByPacienteId(id);
    }

    @GetMapping()
    public List<Cita> getAllCitas(){
        return citaService.findAll();
    }

    @GetMapping("/id")
    public Cita findById(@RequestParam Long id){
        return citaService.findById(id);
    }



    
}
