package com.example.ss1.repositories.Horario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Horario.Descanso;

public interface DescansoRepo extends JpaRepository<Descanso,Long>{
    List<Descanso> findAllByHorarioId(Long idHorario);
}
