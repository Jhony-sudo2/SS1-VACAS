package com.example.ss1.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.ConfirmarCorreoRequest;
import com.example.ss1.DTOS.UpdateEstado;
import com.example.ss1.DTOS.UserCreate;
import com.example.ss1.DTOS.UpdateUser.UpdatePass;
import com.example.ss1.DTOS.UpdateUser.UpdatePassword;
import com.example.ss1.models.Empleado;
import com.example.ss1.models.Paciente;
import com.example.ss1.services.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UsuarioService service;

    @PostMapping
    @Operation(summary = "Guardar un nuevo usuario")
    public void saveUser(@RequestBody UserCreate User){
        service.saveUsuario(User);
    }

    @PostMapping("/confirmarCorreo")
    public ResponseEntity<?> confirmarCorreo(@RequestBody ConfirmarCorreoRequest codigo){
        service.confirmarCorreo(codigo.codigo());
        return ResponseEntity.ok("Correo confirmaco correctamente");
    }
    
    @PutMapping("/actualizarEstado")
    public void actualizarEstado(@RequestBody UpdateEstado id){
        service.updateEstado(id.getId());
    }

    @GetMapping
    public Empleado getById(@RequestParam Long id){
        return service.findEmpleadoById(id);
    }

    @GetMapping("/empleado")
    public List<Empleado> getAllEmpleados(){
        return service.getAllEmpleados();
    }

    @GetMapping("/paciente")
    public List<Paciente> getAllPacientes(){
        return service.getAllPacientes();
    }

    @PutMapping("/empleado")
    public void updateEmpleado(@RequestBody Empleado empleado){
        service.updateEmpleado(empleado);
    }

    @PutMapping("/paciente")
    public void updatePaciente(@RequestBody Paciente paciente){
        service.updatePaciente(paciente);
    }

    @PutMapping("/password")
    public void updatePassword(@RequestBody UpdatePassword data){
        service.UpdatePassword(data);
    }

    @PostMapping("/recuperarcontrasenia")
    public void recupearContrasenia(@RequestBody ConfirmarCorreoRequest data){
        service.recuperarContrasenia(data.email());
    }

    @PostMapping("/confirmarcodigo")
    public ResponseEntity<?> confirmarCodigo(@RequestBody ConfirmarCorreoRequest data){
        return service.confirmarCodigo(data);
    }

    @PutMapping("/password/cambiar")
    public void cambiarContrasenia(@RequestBody UpdatePass data){
        service.cambioPassword(data.getEmail(),data.getNueva());
    }

    @GetMapping("/paciente/id")
    public Paciente findPacienteByUsuarioId(@RequestParam Long id){
        return service.findPacienteByUsuarioId(id);
    }

    @GetMapping("/empleado/id")
    public Empleado findEmpleadoByUsuarioId(@RequestParam Long id){
        return service.findEmpleadoByUsuarioId(id);
    }
}
