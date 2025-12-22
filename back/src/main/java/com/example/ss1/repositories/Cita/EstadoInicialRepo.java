package com.example.ss1.repositories.Cita;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Cita.EstadoInicial;

public interface EstadoInicialRepo extends JpaRepository<EstadoInicial,Long>{
    Optional<EstadoInicial> findByHistoriaId(Long id);
}
