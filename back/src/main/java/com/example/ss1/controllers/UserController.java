package com.example.ss1.controllers;

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
import com.example.ss1.models.Empleado;
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




}
