package com.example.ss1.repositories.Cita;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Cita.Receta;

public interface RecetaRepo extends JpaRepository<Receta,Long>{
    List<Receta> findAllByPacienteId(Long pacienteId);
}
