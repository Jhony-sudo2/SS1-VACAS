package com.example.ss1.repositories.PacienteData;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.PacienteData.Antecedente;

public interface AntecedentesRepo extends JpaRepository<Antecedente,Long>{
    Optional<Antecedente> findByPacienteId(Long pacienteId);
}
