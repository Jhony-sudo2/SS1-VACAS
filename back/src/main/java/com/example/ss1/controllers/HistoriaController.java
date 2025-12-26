package com.example.ss1.controllers;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.CitaDTO.DarAlta;
import com.example.ss1.DTOS.CitaDTO.HistoriaCompleta;
import com.example.ss1.DTOS.CitaDTO.HistoriaDetail;
import com.example.ss1.DTOS.CitaDTO.SesionDetail;
import com.example.ss1.DTOS.CitaDTO.UpdateState;
import com.example.ss1.models.Cita.Historia;
import com.example.ss1.models.Cita.ImpresionDiagnostica;
import com.example.ss1.models.Cita.PruebasAplicadas;
import com.example.ss1.models.Cita.Receta;
import com.example.ss1.models.Cita.Sesion;
import com.example.ss1.models.Cita.Tarea;
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
    public List<LocalDateTime> getHorarios(@RequestParam Long id,@RequestParam LocalDate fecha,@RequestParam int duracion){
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

    @PostMapping("/sesion")
    public void crearSesion(@RequestBody Sesion sesion){
        historiaService.saveSesion(sesion);
    }

    @GetMapping("/sesionHistoria")
    public List<Sesion> getSesionByHistoria(@RequestParam Long id){
        return historiaService.findSesionByHistoria(id);
    }

    @PostMapping("/prueba")
    public void guardarPrueba(@RequestBody PruebasAplicadas pruebasAplicadas){
        historiaService.guardarPrueba(pruebasAplicadas);
    }

    @PostMapping("/impresion")
    public void guardarImpresion(@RequestBody ImpresionDiagnostica data){
        historiaService.guardarImpresionDiagnostica(data);  
    }

    @GetMapping("/sesion/details")
    public SesionDetail getDetailSesion(@RequestParam Long id){
        return historiaService.getDetalleSesion(id);
    }

    @PostMapping("/darAlta")
    public void darAlta(@RequestBody DarAlta data){
        historiaService.darAlta(data);
    }

    @PostMapping("/tarea")
    public void saveTarea(@RequestBody Tarea tarea){
        historiaService.saveTarea(tarea);
    }

    @GetMapping("/tarea")
    public List<Tarea> getTareas(@RequestParam Long id){
        return historiaService.getTareas(id);
    }

    @PostMapping("/receta")
    public void saveReceta(@RequestBody List<Receta> recetas){
        historiaService.saveReceta(recetas);    
    }

    @GetMapping("/receta")
    public List<Receta> getRecetas(@RequestParam Long id){
        return historiaService.findRecetaByPaciente(id);
    }

    @PostMapping("/tarea/completar")
    public void completarReceta(@RequestBody UpdateState id){
        historiaService.completarTarea(id.getId());
    }


}
