package com.example.ss1.repositories.PacienteData;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.PacienteData.HistoriaPersonal;

public interface HistoriaPersonalRepo extends JpaRepository<HistoriaPersonal,Long>{
    
}
