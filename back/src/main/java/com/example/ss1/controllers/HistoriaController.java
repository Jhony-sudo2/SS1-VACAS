package com.example.ss1.controllers;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.CitaDTO.HistoriaCompleta;
import com.example.ss1.DTOS.CitaDTO.HistoriaDetail;
import com.example.ss1.models.Cita.Historia;
import com.example.ss1.services.HistoriaService;


@RestController
@RequestMapping("/historia")
public class HistoriaController {
    @Autowired
    private HistoriaService historiaService;

    @PostMapping()
    public void saveHistoria(@RequestBody HistoriaCompleta data){
        historiaService.saveHistoria(data.getHistoriaCreate(), data.getPersonal(), data.getAntecedente(), data.getEstadoInicial());
    }
    @GetMapping()
    public List<Historia> getAll(){
        return historiaService.findAll();
    }

    @GetMapping("/horarios")
    public List<LocalDateTime> getHorarios(@RequestParam Long id,@RequestParam LocalDateTime fecha,@RequestParam int duracion){
        return historiaService.getHorariosDisponibles(id, fecha, duracion);
    }

    @GetMapping("/empleado")
    public List<Historia> findByEmpleado(@RequestParam Long id){
        return historiaService.findByEmpleado(id);
    }

    @GetMapping("/paciente")
    public List<Historia> findByPaciente(@RequestParam Long id){
        return historiaService.findByPaciente(id);
    }

    @GetMapping("/details")
    public HistoriaDetail findById(@RequestParam Long id){
        return historiaService.getDetailsHistoria(id);
    }

    @GetMapping("/id")
    public Historia findHistoriaById(@RequestParam Long id){
        return historiaService.findById(id);
    }

}
