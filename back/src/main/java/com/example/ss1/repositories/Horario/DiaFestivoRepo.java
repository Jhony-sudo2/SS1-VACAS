package com.example.ss1.repositories.Horario;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Horario.DiaFestivo;

public interface DiaFestivoRepo extends JpaRepository<DiaFestivo,Long>{
    
}
