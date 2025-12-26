package com.example.ss1.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.ss1.DTOS.CitaDTO.DarAlta;
import com.example.ss1.DTOS.CitaDTO.HistoriaCreate;
import com.example.ss1.DTOS.CitaDTO.HistoriaDetail;
import com.example.ss1.DTOS.CitaDTO.SesionDetail;
import com.example.ss1.enums.EstadoHistoria;
import com.example.ss1.errors.ApiException;
import com.example.ss1.models.Empleado;
import com.example.ss1.models.Empresa;
import com.example.ss1.models.Paciente;
import com.example.ss1.models.Cita.Cita;
import com.example.ss1.models.Cita.EstadoInicial;
import com.example.ss1.models.Cita.Historia;
import com.example.ss1.models.Cita.ImpresionDiagnostica;
import com.example.ss1.models.Cita.PruebasAplicadas;
import com.example.ss1.models.Cita.Receta;
import com.example.ss1.models.Cita.Sesion;
import com.example.ss1.models.Cita.Tarea;
import com.example.ss1.models.Horario.Descanso;
import com.example.ss1.models.Horario.Horario;
import com.example.ss1.models.PacienteData.Antecedente;
import com.example.ss1.models.PacienteData.HistoriaPersonal;
import com.example.ss1.repositories.EmpresaRepo;
import com.example.ss1.repositories.Cita.CitaRepo;
import com.example.ss1.repositories.Cita.EstadoInicialRepo;
import com.example.ss1.repositories.Cita.HistoriaRepo;
import com.example.ss1.repositories.Cita.ImpresionDiagnosticaRepo;
import com.example.ss1.repositories.Cita.PruebasAplicadasRepo;
import com.example.ss1.repositories.Cita.RecetaRepo;
import com.example.ss1.repositories.Cita.SesionRepo;
import com.example.ss1.repositories.Cita.TareaRepo;
import com.example.ss1.repositories.Horario.DescansoRepo;
import com.example.ss1.repositories.Horario.HorarioRepo;
import com.example.ss1.repositories.PacienteData.AntecedentesRepo;
import com.example.ss1.repositories.PacienteData.HistoriaPersonalRepo;

@Service
public class HistoriaService {
    @Autowired
    private HistoriaRepo historiaRepo;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private HistoriaPersonalRepo historiaPersonalRepo;
    @Autowired
    private AntecedentesRepo antecedentesRepo;
    @Autowired
    private EstadoInicialRepo estadoInicialRepo;
    @Autowired
    private SesionRepo sesionRepo;
    @Autowired
    private EmpresaRepo empresaRepo;
    @Autowired
    private HorarioRepo horarioRepo;
    @Autowired
    private DescansoRepo descansoRepo;
    @Autowired
    private CitaRepo citaRepo;
    @Autowired
    private PruebasAplicadasRepo pruebasAplicadasRepo;
    @Autowired
    private ImpresionDiagnosticaRepo impresionDiagnosticaRepo;
    @Autowired
    private TareaRepo tareaRepo;
    @Autowired
    private RecetaRepo recetaRepo;

    public List<Historia> findAll() {
        return historiaRepo.findAll();
    }

    public void saveHistoria(HistoriaCreate data, HistoriaPersonal personal, Antecedente antecedente,
            EstadoInicial estadoInicial) {
        Empleado empleado = usuarioService.findEmpleadoById(data.getEmpleadoId());
        Paciente paciente = usuarioService.findPacienteById(data.getPacienteId());

        Historia historia = new Historia();
        historia.setEmpleado(empleado);
        historia.setPaciente(paciente);
        historia.setCostoSesion(data.getCostoSesion());
        historia.setDuracion(data.getDuracion());
        historia.setEstado(EstadoHistoria.ACTIVO);
        historia.setEnfoque(data.getEnfoque());
        historia.setFechaApertura(data.getFechaApertura());
        historia.setFrecuencia(data.getFrecuencia());
        historia.setModalidad(data.getModalidad());
        historia.setSesiones(data.getSesiones());
        historia.setProcedencia(data.getProcedencia());
        historia.setMotivoConsulta(data.getMotivoConsulta());
        Historia saveHistoria = historiaRepo.save(historia);
        personal.setHistoria(saveHistoria);
        historiaPersonalRepo.save(personal);
        antecedente.setPaciente(paciente);
        antecedentesRepo.save(antecedente);
        estadoInicial.setHistoria(saveHistoria);
        estadoInicialRepo.save(estadoInicial);
    }

    public List<Historia> findByEmpleado(Long idEmpleado) {
        Empleado empleado = usuarioService.findEmpleadoById(idEmpleado);
        return historiaRepo.findAllByEmpleadoId(empleado.getId());
    }

    public List<Historia> findByPaciente(Long idPaciente) {
        Paciente paciente = usuarioService.findPacienteByUsuarioId(idPaciente);
        return historiaRepo.findAllByPacienteId(paciente.getId());
    }

    public Historia findById(Long historiaId) {
        return historiaRepo.findById(historiaId)
                .orElseThrow(() -> new ApiException("Historia no encontrada", HttpStatus.NOT_FOUND));
    }

    public HistoriaDetail getDetailsHistoria(Long historiaId) {
        HistoriaDetail data = new HistoriaDetail();
        Historia historia = findById(historiaId);
        Antecedente antecedente = antecedentesRepo.findByPacienteId(historia.getPaciente().getId())
                .orElseThrow(() -> new ApiException("Antecedente no encontrado", HttpStatus.NOT_FOUND));
        EstadoInicial estadoInicial = estadoInicialRepo.findByHistoriaId(historiaId)
                .orElseThrow(() -> new ApiException("Estado inicial no encontrado", HttpStatus.NOT_FOUND));
        HistoriaPersonal historiaPersonal = historiaPersonalRepo.findByHistoriaId(historiaId)
                .orElseThrow(() -> new ApiException("Historia personal no encontrada", HttpStatus.NOT_FOUND));
        data.setHistoria(historia);
        data.setHistoriaPersonal(historiaPersonal);
        data.setEstadoInicial(estadoInicial);
        data.setAntecedente(antecedente);
        return data;
    }

    public void saveSesion(Sesion sesion) {
        sesionRepo.save(sesion);
    }

    public List<LocalDateTime> getHorariosDisponibles(Long empleadoId, LocalDate fecha, int duracionSesion) {

        if (empleadoId == null)
            throw new IllegalArgumentException("empleadoId es requerido");
        if (fecha == null)
            throw new IllegalArgumentException("fecha es requerida");
        if (duracionSesion <= 0)
            throw new IllegalArgumentException("duracionSesion debe ser > 0");

        // Validar que exista el empleado
        usuarioService.findEmpleadoById(empleadoId);

        int diaSemana = fecha.getDayOfWeek().getValue(); // 1..7 (Lunes..Domingo)

        // 1) Horario laboral del empleado ese día (1 horario por día)
        Horario horario = horarioRepo.findByEmpleadoIdAndDia(empleadoId, diaSemana)
                .orElse(null);

        if (horario == null || !horario.isTrabaja())
            return List.of();

        LocalDateTime inicioJornada = fecha.atTime(horario.getHoraEntrada());
        LocalDateTime finJornada = fecha.atTime(horario.getHoraSalida());

        // ✅ como ahora solo recibís día, arrancás desde el inicio de jornada
        LocalDateTime inicioBusqueda = inicioJornada;

        // Si no cabe una sesión en la jornada, no hay nada
        if (inicioBusqueda.plusMinutes(duracionSesion).isAfter(finJornada))
            return List.of();

        // 2) Rango del día para traer citas/sesiones
        LocalDateTime iniDia = fecha.atStartOfDay();
        LocalDateTime finDia = fecha.plusDays(1).atStartOfDay();

        List<Intervalo> ocupados = new ArrayList<>();

        // 3) Descansos (ocupados)
        List<Descanso> descansos = descansoRepo.findAllByHorarioId(horario.getId());
        for (Descanso d : descansos) {
            if (d.getInicio() == null || d.getFin() == null)
                continue;

            LocalDateTime a = fecha.atTime(d.getInicio());
            LocalDateTime b = fecha.atTime(d.getFin());

            if (b.isAfter(a))
                ocupados.add(new Intervalo(a, b));
        }

        // 4) Citas del día (ocupados) con duración fija de empresa
        int duracionCitaMin = obtenerDuracionCitaMin();
        List<Cita> citas = citaRepo.findOcupadasByEmpleadoAndRango(empleadoId, iniDia, finDia); // estado != CANCELADA
        for (Cita c : citas) {
            if (c.getFecha() == null)
                continue;

            LocalDateTime a = c.getFecha();
            LocalDateTime b = a.plusMinutes(duracionCitaMin);
            ocupados.add(new Intervalo(a, b));
        }

        // 5) Sesiones del día (ocupados) duración variable: historia.duracion
        List<Sesion> sesiones = sesionRepo.findByEmpleadoAndRango(empleadoId, iniDia, finDia);
        for (Sesion s : sesiones) {
            if (s.getFecha() == null)
                continue;

            int dur = (s.getHistoria() != null) ? s.getHistoria().getDuracion() : 0;
            if (dur <= 0)
                continue;

            LocalDateTime a = s.getFecha();
            LocalDateTime b = a.plusMinutes(dur);
            ocupados.add(new Intervalo(a, b));
        }

        // 6) Merge de intervalos ocupados
        List<Intervalo> ocupadosMerge = mergeIntervalos(ocupados);

        // 7) Generar slots disponibles
        final int STEP_MIN = 15;

        List<LocalDateTime> disponibles = new ArrayList<>();
        for (LocalDateTime t = inicioBusqueda; !t.plusMinutes(duracionSesion).isAfter(finJornada); t = t
                .plusMinutes(STEP_MIN)) {

            Intervalo cand = new Intervalo(t, t.plusMinutes(duracionSesion));
            if (!chocaConOcupados(cand, ocupadosMerge)) {
                disponibles.add(t);
            }
        }

        return disponibles;
    }

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
            return this.ini.isBefore(other.fin) && other.ini.isBefore(this.fin);
        }

        LocalDateTime ini() {
            return ini;
        }

        LocalDateTime fin() {
            return fin;
        }
    }

    private static boolean chocaConOcupados(Intervalo candidato, List<Intervalo> ocupados) {
        for (Intervalo o : ocupados) {
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

    private int obtenerDuracionCitaMin() {
        Empresa emp = empresaRepo.findById(1l)
                .orElseThrow(() -> new ApiException("Datos de empresa no cargados", HttpStatus.NOT_FOUND));

        return emp.getTiempoCita();
    }

    public void guardarSesion(Sesion sesion) {
        sesionRepo.save(sesion);
    }

    public void guardarPrueba(PruebasAplicadas pruebasAplicadas) {
        pruebasAplicadasRepo.save(pruebasAplicadas);
    }

    public void guardarImpresionDiagnostica(ImpresionDiagnostica impresionDiagnostica) {
        impresionDiagnosticaRepo.save(impresionDiagnostica);
    }

    public SesionDetail getDetalleSesion(Long sesionId) {
        Sesion sesion = sesionRepo.findById(sesionId)
                .orElseThrow(() -> new ApiException("Sesion no econtrada", HttpStatus.NOT_FOUND));
        List<PruebasAplicadas> pruebasAplicadas = pruebasAplicadasRepo.findAllBySesionId(sesionId);
        ImpresionDiagnostica impresionDiagnostica = new ImpresionDiagnostica();
        if (!impresionDiagnosticaRepo.findAllBySesionId(sesionId).isEmpty()) {
            impresionDiagnostica = impresionDiagnosticaRepo.findAllBySesionId(sesionId).get(0);
        }
        return new SesionDetail(sesion, pruebasAplicadas, impresionDiagnostica);
    }

    public void saveTarea(Tarea tarea) {
        tarea.setEstado(false);
        tareaRepo.save(tarea);
    }

    public List<Tarea> getTareas(Long id) {
        return tareaRepo.findAllByPacienteId(id);
    }

    public void saveReceta(List<Receta> receta) {
        recetaRepo.saveAll(receta);
    }

    public List<Receta> findRecetaByPaciente(Long pacienteId) {
        return recetaRepo.findAllByPacienteId(pacienteId);
    }

    public void darAlta(DarAlta data) {
        Historia historia = findById(data.getId());
        historia.setMotivoAlta(data.getMotivo());
        historia.setEstado(EstadoHistoria.ALTA);
        historiaRepo.save(historia);
    }

    public List<Sesion> findSesionByHistoria(Long historiaId) {
        return sesionRepo.findAllByHistoriaId(historiaId);
    }

    public void completarTarea(Long tareaId){
        Tarea tarea = tareaRepo.findById(tareaId)
        .orElseThrow(()-> new ApiException("Tarea no encontrada", HttpStatus.NOT_FOUND));
        tarea.setEstado(true);
    }

}
