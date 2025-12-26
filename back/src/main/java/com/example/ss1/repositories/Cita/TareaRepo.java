package com.example.ss1.repositories.Cita;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Cita.Tarea;

public interface TareaRepo extends JpaRepository<Tarea,Long>{
    List<Tarea> findAllByPacienteId(Long id);
}
