package com.example.ss1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.PrincipalDTO;
import com.example.ss1.models.Empresa;
import com.example.ss1.services.EmpresaService;

@RestController
@RequestMapping("/empresa")
public class EmpresaController {
    @Autowired
    private EmpresaService empresaService;

    @GetMapping()
    public Empresa getEmpresaData(){
        return empresaService.getEmpresaData();
    }

    @PutMapping()
    public void updateEmpresa(@RequestBody Empresa empresa){
        empresaService.updateEmpresa(empresa);
    }

    @GetMapping("/dashboard")
    public PrincipalDTO getPrincipal(){
        return empresaService.getPrincipalEmpleado();
    }
}
