package com.example.ss1.repositories.Medicamento;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Medicamentos.Medicamento;

public interface MedicamentoRepo extends JpaRepository<Medicamento,Long>{
    
}
