package com.example.ss1.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ss1.DTOS.ConfirmarCorreoRequest;
import com.example.ss1.DTOS.EmpleadoDTO;
import com.example.ss1.DTOS.PacienteDTO;
import com.example.ss1.DTOS.UserCreate;
import com.example.ss1.DTOS.UpdateUser.UpdatePassword;
import com.example.ss1.enums.Rol;
import com.example.ss1.errors.ApiException;
import com.example.ss1.models.CodigoConfirmacion;
import com.example.ss1.models.Empleado;
import com.example.ss1.models.Paciente;
import com.example.ss1.models.Usuario;
import com.example.ss1.repositories.CodigoConfirmacionRepo;
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
    @Autowired
    private CodigoConfirmacionRepo codigoConfirmacionRepo;

    public void saveUsuario(UserCreate dataCreate) {
        Optional<Usuario> tmp = usuarioRepo.findByEmail(dataCreate.getUsuario().getEmail());
        if (tmp.isPresent()) {
            throw new ApiException("El correo electrónico ya está asociado a una cuenta",
                    HttpStatus.BAD_REQUEST);
        }

        Usuario usuario = dataCreate.getUsuario();
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        usuario.setEmailVerificado(false);

        String codigo = mailService.generarCodigo();
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
                    data.getTelefonoEmergencia(), data.getProcedencia(), usuario,data.getFechaNacimiento());
            pacienteRepo.save(paciente);
        }
        mailService.enviarCodigo("Confirmacion de correo electronico",usuario, codigo);
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

    public Paciente findPacienteByUsuarioId(Long id) {
        return pacienteRepo.findByUsuarioId(id)
                .orElseThrow(() -> new ApiException("Paciente no encontrado", HttpStatus.NOT_FOUND));
    }

    public Empleado findEmpleadoByUsuarioId(Long id){
        return empleadoRepo.findByUsuarioId(id)
        .orElseThrow(() -> new ApiException("Empleado no encontrado", HttpStatus.NOT_FOUND));
    }

    public Usuario findByEmail(String email) {
        return usuarioRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException("Usuario no encotrado", HttpStatus.NOT_FOUND));
    }

    public void updateEstado(Long id) {
        Usuario usuario = findById(id);
        usuario.setEstado(!usuario.isEstado());
        usuarioRepo.save(usuario);
    }

    public List<Paciente> getAllPacientes() {
        return pacienteRepo.findAll();
    }

    public void UpdatePassword(UpdatePassword data) {
        Usuario usuario = findById(data.getUsuarioId());
        if (data.getNueva().length() < 7)
            throw new ApiException("La contrase;a tiene que tener 8 caracteres", HttpStatus.BAD_REQUEST);
        if (passwordEncoder.matches(data.getActual(), usuario.getPassword())) {
            String nueva = passwordEncoder.encode(data.getNueva());
            usuario.setPassword(nueva);
            usuarioRepo.save(usuario);
        } else
            throw new ApiException("Credenciales incorrectas", HttpStatus.NOT_FOUND);
    }

    public void cambioPassword(String email,String nueva) {
        Usuario usuario = findByEmail(email);
        if (nueva.length() < 7)
            throw new ApiException("La contrase;a tiene que tener 8 caracteres", HttpStatus.BAD_REQUEST);
        String nuevapass = passwordEncoder.encode(nueva);
        usuario.setPassword(nuevapass);
        usuarioRepo.save(usuario);
    }

    public void recuperarContrasenia(String email) {
        Usuario usuario = usuarioRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException("Usuario no encontrado", HttpStatus.NOT_FOUND));
        CodigoConfirmacion tmp = new CodigoConfirmacion();
        String codigo = mailService.generarCodigo();
        mailService.enviarCodigo("RECUPERAR CONTRASENIA",usuario, codigo);
        tmp.setCodigo(codigo);
        tmp.setEmail(usuario.getEmail());
        tmp.setVencimiento(LocalDateTime.now().plusMinutes(15));
        tmp.setTipo(2);
        Optional<CodigoConfirmacion> existe = codigoConfirmacionRepo.findByEmailAndTipo(usuario.getEmail(), 2);
        if (existe.isPresent())
            codigoConfirmacionRepo.delete(existe.get());
        codigoConfirmacionRepo.save(tmp);
    }

    public ResponseEntity<?> confirmarCodigo(ConfirmarCorreoRequest tmp) {
        Optional<CodigoConfirmacion> codigo = codigoConfirmacionRepo.findByEmailAndTipo(tmp.email(), 2);
        if (codigo.isPresent()) {
            if (codigo.get().getCodigo().equals(tmp.codigo())) {
                System.out.println("ES CORRECTO");
                codigoConfirmacionRepo.delete(codigo.get());
                return ResponseEntity.ok("CODIGO CORRECTO");
            } else
                throw new ApiException("Codigo no valido", HttpStatus.NOT_FOUND);
        } else
            throw new ApiException("Codigo no encontrado", HttpStatus.NOT_FOUND);
    }

    public List<Empleado> getAllEmpleados() {
        return empleadoRepo.findAll();
    }

    public void updateEmpleado(Empleado empleado){
        Empleado empleado2 = findEmpleadoById(empleado.getId());
        empleado2.setEstadoCivil(empleado.isEstadoCivil());
        empleado2.setFechaNacimiento(empleado.getFechaNacimiento());
        empleado2.getUsuario().setA2f(empleado.getUsuario().isA2f());
        empleado2.setTelefono(empleado.getTelefono());
        empleadoRepo.save(empleado2);
    }

    public void updatePaciente(Paciente paciente){
        Paciente paciente2 = findPacienteById(paciente.getId());
        paciente2.setFechaNacimiento(paciente.getFechaNacimiento());
        paciente2.setTelefono(paciente.getTelefono());
        paciente2.setGenero(paciente.isGenero());
        paciente2.setDireccion(paciente.getDireccion());
        paciente2.setPersonaEmergencia(paciente.getPersonaEmergencia());
        paciente2.setTelefonoEmergencia(paciente.getTelefonoEmergencia());
        paciente2.setNivelEducativo(paciente.getNivelEducativo());
        paciente2.setProcedencia(paciente.getProcedencia());
        paciente2.getUsuario().setA2f(paciente.getUsuario().isA2f());
        pacienteRepo.save(paciente2);

    }

    public List<Usuario> findByRol(Rol rol){
        return usuarioRepo.findAllByRol(rol);
    }

}
