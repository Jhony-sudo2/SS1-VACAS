package com.example.ss1.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.ss1.models.Empleado;

public interface EmpleadoRepo extends JpaRepository<Empleado,Long>{
    Optional<Empleado> findByUsuarioId(Long id);
    @Query("select coalesce(sum(e.sueldo),0) from Empleado e")
    Double sumSueldos();
}
