package com.example.ss1.repositories.PagoRepo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ss1.DTOS.ReportesDTO.TopMedicamentoDTO;
import com.example.ss1.models.Pagos.DetalleVenta;

public interface DetalleVentaRepo extends JpaRepository<DetalleVenta,Long>{
    List<DetalleVenta> findAllByFacturaId(Long id);
    // Top medicamentos vendidos por periodo
    @Query("""
        select new com.example.ss1.DTOS.ReportesDTO.TopMedicamentoDTO(
            m.id, m.nombre,
            sum(dv.cantidad)
        )
        from DetalleVenta dv
        join dv.factura f
        join dv.medicamento m
        where f.fecha between :desde and :hasta
        group by m.id, m.nombre
        order by sum(dv.cantidad) desc
    """)
    List<TopMedicamentoDTO> topMedicamentosVendidos(
        @Param("desde") LocalDate desde,
        @Param("hasta") LocalDate hasta,
        Pageable pageable
    );
}
