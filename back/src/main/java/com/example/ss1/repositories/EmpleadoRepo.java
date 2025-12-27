package com.example.ss1.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Empleado;

public interface EmpleadoRepo extends JpaRepository<Empleado,Long>{
    Optional<Empleado> findByUsuarioId(Long id);
}
