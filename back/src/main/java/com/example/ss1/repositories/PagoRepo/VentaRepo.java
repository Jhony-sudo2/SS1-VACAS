package com.example.ss1.repositories.PagoRepo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ss1.models.Pagos.Venta;

public interface VentaRepo extends JpaRepository<Venta,Long>{
    List<Venta> findAllByPacienteId(Long idPaciente);
     // Historial por periodo
    List<Venta> findAllByFechaBetween(LocalDate desde, LocalDate hasta);

    // Ingresos por ventas (total) en periodo
    @Query("select coalesce(sum(v.total),0) from Venta v where v.fecha between :desde and :hasta")
    Double sumTotalBetween(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);
}
