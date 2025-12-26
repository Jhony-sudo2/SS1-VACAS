package com.example.ss1.repositories.PagoRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.models.Pagos.DetalleVenta;

public interface DetalleVentaRepo extends JpaRepository<DetalleVenta,Long>{
    
}
