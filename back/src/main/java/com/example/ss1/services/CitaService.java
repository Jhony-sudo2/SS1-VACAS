package com.example.ss1.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.ss1.DTOS.CitaDTO.CitaCreate;
import com.example.ss1.DTOS.CitaDTO.DisponibilidadCita;
import com.example.ss1.enums.Estado;
import com.example.ss1.errors.ApiException;
import com.example.ss1.models.Empleado;
import com.example.ss1.models.Empresa;
import com.example.ss1.models.Paciente;
import com.example.ss1.models.Cita.Cita;
import com.example.ss1.models.Cita.Sesion;
import com.example.ss1.models.Horario.Descanso;
import com.example.ss1.models.Horario.Horario;
import com.example.ss1.repositories.AsignacionAreaRepo;
import com.example.ss1.repositories.AsignacionServicioRepo;
import com.example.ss1.repositories.EmpresaRepo;
import com.example.ss1.repositories.ServicioRepo;
import com.example.ss1.repositories.Cita.CitaRepo;
import com.example.ss1.repositories.Cita.SesionRepo;
import com.example.ss1.repositories.Horario.DescansoRepo;
import com.example.ss1.repositories.Horario.HorarioRepo;

@Service
public class CitaService {
    @Autowired
    private CitaRepo citaRepo;
    @Autowired
    private EmpresaRepo empresaRepo;
    @Autowired
    private SesionRepo sesionRepo;
    @Autowired
    private AsignacionAreaRepo asignacionAreaRepo;
    @Autowired
    private AsignacionServicioRepo asignacionServicioRepo;
    @Autowired
    private HorarioRepo horarioRepo;
    @Autowired
    private DescansoRepo descansoRepo;
    @Autowired
    private ServicioRepo servicioRepo;
    @Autowired
    private UsuarioService usuarioService;
    //private static final int STEP_MIN = 15;

    public List<DisponibilidadCita> getPosibles(Long servicioId, LocalDate fecha) {
        servicioRepo.findById(servicioId)
        .orElseThrow(()-> new ApiException("Servicio no encontrado", HttpStatus.NOT_FOUND));

        List<Long> areaIds = asignacionServicioRepo.findDistinctAreaIdsByServicioId(servicioId);
        if (areaIds.isEmpty())
            return List.of();

        List<Empleado> empleados = asignacionAreaRepo.findDistinctEmpleadosByAreaIds(areaIds);
        if (empleados.isEmpty())
            return List.of();

        int duracionCitaMin = obtenerDuracionCitaMin(); // de Empresa
        int dia = fecha.getDayOfWeek().getValue(); // 1..7

        LocalDateTime iniDia = fecha.atStartOfDay();
        LocalDateTime finDia = fecha.plusDays(1).atStartOfDay();

        List<DisponibilidadCita> out = new ArrayList<>();

        for (Empleado emp : empleados) {

            Optional<Horario> hOpt = horarioRepo.findByEmpleadoIdAndDia(emp.getId(), dia);
            if (hOpt.isEmpty() || !hOpt.get().isTrabaja())
                continue;

            Horario h = hOpt.get();
            LocalDateTime inicioJornada = fecha.atTime(h.getHoraEntrada());
            LocalDateTime finJornada = fecha.atTime(h.getHoraSalida());

            // 1) Ocupados
            List<Intervalo> ocupados = new ArrayList<>();

            // Descansos
            for (Descanso d : descansoRepo.findAllByHorarioId(h.getId())) {
                LocalDateTime a = fecha.atTime(d.getInicio());
                LocalDateTime b = fecha.atTime(d.getFin());
                if (b.isAfter(a))
                    ocupados.add(new Intervalo(a, b));
            }

            // Citas (ocupadas = NO canceladas)
            List<Cita> citas = citaRepo.findOcupadasByEmpleadoAndRango(emp.getId(), iniDia, finDia);
            for (Cita c : citas) {
                LocalDateTime a = c.getFecha();
                LocalDateTime b = a.plusMinutes(duracionCitaMin);
                ocupados.add(new Intervalo(a, b));
            }

            // Sesiones (duración variable)
            List<Sesion> sesiones = sesionRepo.findByEmpleadoAndRango(emp.getId(), iniDia, finDia);
            for (Sesion s : sesiones) {
                int dur = (s.getHistoria() != null) ? s.getHistoria().getDuracion() : 0;
                if (dur <= 0)
                    continue;
                LocalDateTime a = s.getFecha();
                LocalDateTime b = a.plusMinutes(dur);
                ocupados.add(new Intervalo(a, b));
            }

            // Merge intervalos ocupados
            List<Intervalo> ocupadosMerge = mergeIntervalos(ocupados);

            // 2) Generar slots dentro de jornada
            List<LocalDateTime> disponibles = new ArrayList<>();
            int stepMin = 15;

            for (LocalDateTime t = inicioJornada; !t.plusMinutes(duracionCitaMin).isAfter(finJornada); t = t
                    .plusMinutes(stepMin)) {

                Intervalo candidato = new Intervalo(t, t.plusMinutes(duracionCitaMin));
                if (!chocaConOcupados(candidato, ocupadosMerge)) {
                    disponibles.add(t);
                }
            }

            if (!disponibles.isEmpty()) {
                out.add(new DisponibilidadCita(emp.getId(), emp.getNombre(), disponibles));
            }
        }

        return out;
    }

    /**
     * OJO: tu Empresa.tiempoCita está como LocalDateTime, lo cual es raro para una
     * duración.
     * Aquí lo interpreto como "HH:mm" (tiempo del día) equivalente a minutos de
     * duración.
     * Lo ideal: cambiar a int duracionCitaMin o Duration.
     */
    private int obtenerDuracionCitaMin() {
        Empresa emp = empresaRepo.findById(1L)
                .orElseThrow(() -> new ApiException("Datos de empresa no cargados", HttpStatus.NOT_FOUND));

        
        int minutos = emp.getTiempoCita();

        if (minutos <= 0)
            throw new IllegalStateException("Empresa.tiempoCita inválido");
        return minutos;
    }

    // ----------------- Helpers de intervalos -----------------

    private static class Intervalo {
        private final LocalDateTime ini;
        private final LocalDateTime fin;

        Intervalo(LocalDateTime ini, LocalDateTime fin) {
            if (ini == null || fin == null)
                throw new IllegalArgumentException("Intervalo null");
            if (!fin.isAfter(ini))
                throw new IllegalArgumentException("Intervalo inválido (fin <= ini)");
            this.ini = ini;
            this.fin = fin;
        }

        boolean solapa(Intervalo other) {
            // solapan si: ini < other.fin && other.ini < fin
            return this.ini.isBefore(other.fin) && other.ini.isBefore(this.fin);
        }

        LocalDateTime ini() {
            return ini;
        }

        LocalDateTime fin() {
            return fin;
        }
    }

    private static boolean chocaConOcupados(Intervalo candidato, List<Intervalo> ocupadosOrdenadosMerge) {
        // lineal es suficiente normalmente; si tu volumen crece, se optimiza con binary
        // search
        for (Intervalo o : ocupadosOrdenadosMerge) {
            if (candidato.solapa(o))
                return true;
        }
        return false;
    }

    private static List<Intervalo> mergeIntervalos(List<Intervalo> in) {
        if (in == null || in.isEmpty())
            return List.of();

        List<Intervalo> list = new ArrayList<>(in);
        list.sort(Comparator.comparing(Intervalo::ini));

        List<Intervalo> out = new ArrayList<>();
        Intervalo cur = list.get(0);

        for (int i = 1; i < list.size(); i++) {
            Intervalo nxt = list.get(i);

            // Si solapan o se tocan (fin == ini), los unimos
            boolean seTocan = cur.fin().isEqual(nxt.ini());
            if (cur.solapa(nxt) || seTocan) {
                LocalDateTime nuevoFin = cur.fin().isAfter(nxt.fin()) ? cur.fin() : nxt.fin();
                cur = new Intervalo(cur.ini(), nuevoFin);
            } else {
                out.add(cur);
                cur = nxt;
            }
        }
        out.add(cur);

        return out;
    }

    public void agendar(CitaCreate data){
        Cita cita = new Cita();
        System.out.println("FECHA: " + data.getFecha());
        Empleado empleado = usuarioService.findEmpleadoById(data.getEmpleadoId());
        Paciente paciente = usuarioService.findPacienteByUsuarioId(data.getPacienteId());
        cita.setEmpleado(empleado);
        cita.setPaciente(paciente);
        cita.setFecha(data.getFecha());
        cita.setEstado(Estado.AGENDADA);
        citaRepo.save(cita);
    }

}
