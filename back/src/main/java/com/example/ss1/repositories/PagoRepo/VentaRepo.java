package com.example.ss1.repositories.PagoRepo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Pagos.Venta;

public interface VentaRepo extends JpaRepository<Venta,Long>{
    List<Venta> findAllByPacienteId(Long idPaciente);
}
