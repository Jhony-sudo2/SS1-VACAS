package com.example.ss1.services;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ss1.DTOS.AuthResponse;
import com.example.ss1.DTOS.Login;
import com.example.ss1.DTOS.UserDto;
import com.example.ss1.errors.ApiException;
import com.example.ss1.models.CodigoConfirmacion;
import com.example.ss1.models.Usuario;
import com.example.ss1.repositories.CodigoConfirmacionRepo;
import com.example.ss1.repositories.UsuarioRepo;

@Service
public class AuthService {
    @Autowired
    private UsuarioRepo usuarioRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private MailService mailService;
    @Autowired
    private CodigoConfirmacionRepo codigoConfirmacionRepo;
    @Autowired
    private JWTService jwtService;

    public ResponseEntity<?> Login(Login login) {
        System.out.println("Email:" + login.getEmail());
        Usuario usuario = usuarioRepo.findByEmail(login.getEmail())
                .orElseThrow(() -> new ApiException("El usuario no existe", HttpStatus.NOT_FOUND));
        if(!usuario.isEstado())
            throw new ApiException("El usuario esta desactivado", HttpStatus.BAD_REQUEST);
        if (passwordEncoder.matches(login.getPassword(), usuario.getPassword())) {
            if (usuario.isA2f()) {
                String codigo = mailService.generarCodigo();
                mailService.enviarCodigo(usuario, codigo);
                CodigoConfirmacion tmp = new CodigoConfirmacion();
                tmp.setCodigo(codigo);
                tmp.setEmail(usuario.getEmail());
                tmp.setVencimiento(LocalDateTime.now().plusMinutes(15));
                tmp.setTipo(1);
                Optional<CodigoConfirmacion> existe = codigoConfirmacionRepo.findByEmailAndTipo(usuario.getEmail(),1);
                if (existe.isPresent()) 
                    codigoConfirmacionRepo.delete(existe.get());
                codigoConfirmacionRepo.save(tmp);
                return AuthResponse(usuario, false);
            } else {
                return AuthResponse(usuario,true);
            }
        } else
            throw new ApiException("Credenciales incorrectas", HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<?> confirmarCorreo(String email, String codigo) {
        Usuario usuario = usuarioRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException("El usuario no existe", HttpStatus.NOT_FOUND));
        CodigoConfirmacion codigoConfirmacion = codigoConfirmacionRepo.findByEmailAndTipo(email,1)
                .orElseThrow(() -> new ApiException("El usuario no existe", HttpStatus.NOT_FOUND));
        if (codigo.equals(codigoConfirmacion.getCodigo())) {
            codigoConfirmacionRepo.delete(codigoConfirmacion);
            return AuthResponse(usuario,true);
        } else {
            throw new ApiException("Codigo incorrecto", HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<?> AuthResponse(Usuario usuario, Boolean tipo) {
        if (tipo) {
            String token = jwtService.generateToken(usuario);
            UserDto userDto = new UserDto(usuario.getId(), usuario.getEmail(), usuario.getRol());
            AuthResponse tmp = new AuthResponse(token, "Bearer", jwtService.getExpirationSeconds(), userDto, null);
            return ResponseEntity.ok(tmp);
        } else {
            AuthResponse tmp = new AuthResponse(null, "Bearer", jwtService.getExpirationSeconds(), null, null);
            return ResponseEntity.ok(tmp);
        }
    }

}
