package com.example.ss1.repositories.Horario;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Horario.Horario;

public interface HorarioRepo extends JpaRepository<Horario,Long>{
    List<Horario> findAllByEmpleadoId(Long empleadoId);
    Optional<Horario> findByEmpleadoIdAndDia(Long empleadoId,int dia);
}
