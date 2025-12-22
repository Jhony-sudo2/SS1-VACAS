package com.example.ss1.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ss1.DTOS.EmpleadoDTO;
import com.example.ss1.DTOS.PacienteDTO;
import com.example.ss1.DTOS.UserCreate;
import com.example.ss1.errors.ApiException;
import com.example.ss1.models.Empleado;
import com.example.ss1.models.Paciente;
import com.example.ss1.models.Usuario;
import com.example.ss1.repositories.EmpleadoRepo;
import com.example.ss1.repositories.PacienteRepo;
import com.example.ss1.repositories.UsuarioRepo;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepo usuarioRepo;
    @Autowired
    private EmpleadoRepo empleadoRepo;
    @Autowired
    private PacienteRepo pacienteRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private MailService mailService;

    public void saveUsuario(UserCreate dataCreate) {
        Optional<Usuario> tmp = usuarioRepo.findByEmail(dataCreate.getUsuario().getEmail());
        if (tmp.isPresent()) {
            throw new ApiException("El correo electrónico ya está asociado a una cuenta",
                    HttpStatus.BAD_REQUEST);
        }

        Usuario usuario = dataCreate.getUsuario();
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        usuario.setEmailVerificado(false);

        String codigo =  mailService.generarCodigo();
        usuario.setCodigoVerificacion(codigo);
        usuario.setCodigoVerificacionExpira(LocalDateTime.now().plusMinutes(15));

        usuario = usuarioRepo.save(usuario);

        if (dataCreate.getEmpleado() != null) {
            EmpleadoDTO data = dataCreate.getEmpleado();
            Empleado empleado = new Empleado();
            empleado.setColegiado(data.getColegiado());
            empleado.setEstadoCivil(data.isEstadoCivil());
            empleado.setGenero(data.isGenero());
            empleado.setFechaNacimiento(data.getFechaNacimiento());
            empleado.setNombre(data.getNombre());
            empleado.setTelefono(data.getTelefono());
            empleado.setUsuario(usuario);
            empleadoRepo.save(empleado);
        } else if (dataCreate.getPaciente() != null) {
            PacienteDTO data = dataCreate.getPaciente();
            Paciente paciente = new Paciente(data.getNombre(), data.isGenero(), data.isEstadoCivil(),
                    data.getDireccion(), data.getNivelEducativo(), data.getTelefono(), data.getPersonaEmergencia(),
                    data.getTelefonoEmergencia(), data.getProcedencia(), usuario);
            pacienteRepo.save(paciente);
        }
        mailService.enviarCodigo(usuario, codigo);
    }

    /**
     * Confirmar correo recibiendo el código que el usuario ingresa.
     */
    public void confirmarCorreo(String codigo) {
        Usuario usuario = usuarioRepo.findByCodigoVerificacion(codigo)
                .orElseThrow(() -> new ApiException("Código de verificación inválido",
                        HttpStatus.BAD_REQUEST));

        if (usuario.getCodigoVerificacionExpira() == null ||
                usuario.getCodigoVerificacionExpira().isBefore(LocalDateTime.now())) {
            throw new ApiException("El código de verificación ha expirado",
                    HttpStatus.BAD_REQUEST);
        }

        usuario.setEmailVerificado(true);
        usuario.setCodigoVerificacion(null);
        usuario.setCodigoVerificacionExpira(null);
        usuario.setEstado(true);
        usuarioRepo.save(usuario);
    }


    public Usuario findById(Long id) {
        return usuarioRepo.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    public Empleado findEmpleadoById(Long id) {
        return empleadoRepo.findById(id)
                .orElseThrow(() -> new ApiException("Empleado no encontrado", HttpStatus.NOT_FOUND));
    }

    public Paciente findPacienteById(Long id) {
        return pacienteRepo.findById(id)
                .orElseThrow(() -> new ApiException("Paciente no encontrado", HttpStatus.NOT_FOUND));
    }

    public Paciente findPacienteByUsuarioId(Long id){
        return pacienteRepo.findByUsuarioId(id)
        .orElseThrow(()-> new ApiException("Paciente no encontrado", HttpStatus.NOT_FOUND));
    }

    public Usuario findByEmail(String email){
        return usuarioRepo.findByEmail(email)
        .orElseThrow(()-> new ApiException("Usuario no encotrado", HttpStatus.NOT_FOUND));
    }

    public void updateEstado(Long id){
        Usuario usuario  = findById(id);
        usuario.setEstado(!usuario.isEstado());
        usuarioRepo.save(usuario);
    }

    public List<Paciente> getAllPacientes(){
        return pacienteRepo.findAll();
    }

}
