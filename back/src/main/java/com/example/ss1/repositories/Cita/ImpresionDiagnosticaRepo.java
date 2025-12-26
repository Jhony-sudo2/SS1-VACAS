package com.example.ss1.repositories.Cita;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Cita.ImpresionDiagnostica;

public interface ImpresionDiagnosticaRepo extends JpaRepository<ImpresionDiagnostica,Long>{
    List<ImpresionDiagnostica> findAllBySesionId(Long sesionId);
}