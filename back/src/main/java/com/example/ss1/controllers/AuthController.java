package com.example.ss1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.ConfirmarCorreoRequest;
import com.example.ss1.DTOS.Login;
import com.example.ss1.services.AuthService;


@RestController
@RequestMapping("auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @PostMapping("login")
    public ResponseEntity<?> Login(@RequestBody Login login){
        return authService.Login(login);
    }

    @PostMapping("login/a2f")
    public ResponseEntity<?> confirmar(@RequestBody ConfirmarCorreoRequest confirmar){
        return authService.confirmarCorreo(confirmar.email(),confirmar.codigo());
    }
}
