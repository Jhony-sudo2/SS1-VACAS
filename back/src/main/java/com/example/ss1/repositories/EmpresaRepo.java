package com.example.ss1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Empresa;

public interface EmpresaRepo extends JpaRepository<Empresa,Long>{
    
}
