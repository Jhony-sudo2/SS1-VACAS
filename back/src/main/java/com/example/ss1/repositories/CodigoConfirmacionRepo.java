package com.example.ss1.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.CodigoConfirmacion;

public interface CodigoConfirmacionRepo extends JpaRepository<CodigoConfirmacion,Long> {
    Optional<CodigoConfirmacion> findByEmail(String email);
}
