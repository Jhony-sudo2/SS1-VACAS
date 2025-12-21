package com.example.ss1.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ss1.DTOS.AsignacionHorarioDTO;
import com.example.ss1.PrimariasCompuestas.EmpleadoArea;
import com.example.ss1.errors.ApiException;
import com.example.ss1.models.Empleado;
import com.example.ss1.models.EmpleadoR.Area;
import com.example.ss1.models.EmpleadoR.AsignacionArea;
import com.example.ss1.models.Horario.Descanso;
import com.example.ss1.models.Horario.Horario;
import com.example.ss1.repositories.AreaRepo;
import com.example.ss1.repositories.AsignacionAreaRepo;
import com.example.ss1.repositories.EmpleadoRepo;
import com.example.ss1.repositories.Horario.DescansoRepo;
import com.example.ss1.repositories.Horario.HorarioRepo;

@Service
public class EmpleadoService {
    @Autowired
    private HorarioRepo horarioRepo;
    @Autowired
    private DescansoRepo descansoRepo;
    @Autowired
    private EmpleadoRepo empleadoRepo;
    @Autowired
    private AreaRepo areaRepo;
    @Autowired
    private AsignacionAreaRepo asignacionAreaRepo;

    @Transactional
    public void asignarHorario(ArrayList<AsignacionHorarioDTO> data) {
        for (AsignacionHorarioDTO tmp : data) {
            tmp.getHorario().setTrabaja(true);
            Horario horario;
            Optional<Horario> existe = horarioRepo.findByEmpleadoIdAndDia(tmp.getEmpleadoId(),
                    tmp.getHorario().getDia());
            if (!existe.isPresent()) {
                horario = horarioRepo.save(tmp.getHorario());
            } else {
                horario = existe.get();
                existe.get().setHoraEntrada(tmp.getHorario().getHoraEntrada());
                existe.get().setHoraSalida(tmp.getHorario().getHoraSalida());
                horarioRepo.save(existe.get());
            }
            deleteDescansos(horario.getId());
            for (Descanso tmp2Descanso : tmp.getDescansos()) {
                tmp2Descanso.setHorario(horario);
                descansoRepo.save(tmp2Descanso);
            }
        }
    }

    private void deleteDescansos(Long horarioid) {
        List<Descanso> descansos = descansoRepo.findAllByHorarioId(horarioid);
        descansoRepo.deleteAll(descansos);
    }

    public ArrayList<AsignacionHorarioDTO> getHorariosByEmpleadoId(Long empleadoId) {
        ArrayList<AsignacionHorarioDTO> horario = new ArrayList<>();
        Empleado empleado = findEmpleadoById(empleadoId);
        List<Horario> horario2 = horarioRepo.findAllByEmpleadoId(empleadoId);
        for (Horario tmp : horario2) {
            AsignacionHorarioDTO newData = new AsignacionHorarioDTO();
            newData.setEmpleadoId(empleado.getId());
            newData.setHorario(tmp);
            ArrayList<Descanso> descansos = (ArrayList<Descanso>) descansoRepo.findAllByHorarioId(tmp.getId());
            newData.setDescansos(descansos);
            horario.add(newData);
        }
        return horario;
    }

    public Empleado findEmpleadoById(Long empleadoId) {
        return empleadoRepo.findById(empleadoId)
                .orElseThrow(() -> new ApiException("Empleado no encontrado", HttpStatus.NOT_FOUND));
    }

    public void asignarArea(Long idEmpleado, Long[] areas) {
        Empleado empleado = findEmpleadoById(idEmpleado);
        for (Long idArea : areas) {
            Area area = areaRepo.findById(idArea)
            .orElseThrow(()->new ApiException("Area no encontrada", HttpStatus.NOT_FOUND));
            AsignacionArea nuevaAsignacion = new AsignacionArea();
            EmpleadoArea id = new EmpleadoArea(idEmpleado, idArea);
            nuevaAsignacion.setArea(area);
            nuevaAsignacion.setEmpleado(empleado);
            nuevaAsignacion.setId(id);
            asignacionAreaRepo.save(nuevaAsignacion);
        }

    }

    public List<Empleado> findAllEmpleados() {
        return empleadoRepo.findAll();
    }

    public List<Area> getAreasByEmpleadoId(Long id) {
        findEmpleadoById(id);
        List<AsignacionArea> areas = asignacionAreaRepo.findAllByEmpleadoId(id);
        return areas.stream()
                .map(AsignacionArea::getArea)
                .distinct()
                .toList();
    }

    
}
