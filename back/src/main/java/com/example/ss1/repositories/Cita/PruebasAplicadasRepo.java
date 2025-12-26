package com.example.ss1.repositories.Cita;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Cita.PruebasAplicadas;

public interface PruebasAplicadasRepo extends JpaRepository<PruebasAplicadas,Long>{
    List<PruebasAplicadas> findAllBySesionId(Long sesionId);
}
