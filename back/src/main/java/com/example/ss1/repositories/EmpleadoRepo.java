package com.example.ss1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Empleado;

public interface EmpleadoRepo extends JpaRepository<Empleado,Long>{
    
}
