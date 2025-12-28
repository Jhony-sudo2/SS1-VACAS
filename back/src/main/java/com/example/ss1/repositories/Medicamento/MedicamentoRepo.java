package com.example.ss1.repositories.Medicamento;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.ss1.models.Medicamentos.Medicamento;

public interface MedicamentoRepo extends JpaRepository<Medicamento,Long>{
    @Query("select m from Medicamento m where m.stock <= m.minimo")
    List<Medicamento> findEnMinimo();
}
