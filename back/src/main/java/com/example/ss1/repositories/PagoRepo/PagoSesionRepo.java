package com.example.ss1.repositories.PagoRepo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Pagos.PagoSesion;

public interface PagoSesionRepo extends JpaRepository<PagoSesion,Long>{
    List<PagoSesion> findAllByCita_PacienteId(Long id);
    List<PagoSesion> findAllBySesion_Historia_PacienteId(Long pacienteId);
}
