package com.example.ss1.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Paciente;

public interface PacienteRepo extends JpaRepository<Paciente,Long>{
    Optional<Paciente> findByUsuarioId(Long usuarioId);
}
