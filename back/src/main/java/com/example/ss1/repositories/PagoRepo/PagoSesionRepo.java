package com.example.ss1.repositories.PagoRepo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ss1.DTOS.ReportesDTO.AtencionEmpleadoDTO;
import com.example.ss1.models.Pagos.PagoSesion;

public interface PagoSesionRepo extends JpaRepository<PagoSesion,Long>{
    List<PagoSesion> findAllByCita_PacienteId(Long id);
    List<PagoSesion> findAllBySesion_Historia_PacienteId(Long pacienteId);
    // Ingresos por pagos de sesiones (total) en periodo
    @Query("select coalesce(sum(p.total),0) from PagoSesion p where p.fecha between :desde and :hasta")
    Double sumTotalBetween(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);

    // Estadísticas de atención (por "área" -> aquí lo agrupé por empleado que atiende la cita)
    @Query("""
        select new com.example.ss1.DTOS.ReportesDTO.AtencionEmpleadoDTO(
            e.id, e.nombre,
            count(p.id),
            coalesce(sum(p.total),0)
        )
        from PagoSesion p
        join p.cita c
        join c.empleado e
        where p.fecha between :desde and :hasta
        group by e.id, e.nombre
        order by count(p.id) desc
    """)
    List<AtencionEmpleadoDTO> estadisticasAtencionPorEmpleado(
        @Param("desde") LocalDate desde,
        @Param("hasta") LocalDate hasta
    );
}
