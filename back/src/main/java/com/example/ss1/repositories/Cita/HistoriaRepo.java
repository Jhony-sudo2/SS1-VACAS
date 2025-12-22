package com.example.ss1.repositories.Cita;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Cita.Historia;

public interface HistoriaRepo extends JpaRepository<Historia,Long>{
    List<Historia> findAllByEmpleadoId(Long id);
    List<Historia> findAllByPacienteId(Long id);
}
