package com.example.ss1.configs;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.ss1.models.Empresa;
import com.example.ss1.repositories.EmpresaRepo;

@Component
public class Seeders implements CommandLineRunner{
    private final EmpresaRepo empresaRepo;

    public Seeders(EmpresaRepo empresaRepo){
        this.empresaRepo = empresaRepo;
    }

    @Override
    public void run(String... args){
        if(empresaRepo.count() ==0){
            Empresa empresa = new Empresa();
            empresa.setNombre("Empresa");
            empresa.setTiempoCita(45);
            empresa.setPrecioCita(75);
            empresaRepo.save(empresa);
        }
    }
}
