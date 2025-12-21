package com.example.ss1.repositories.Cita;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ss1.models.Cita.Sesion;

public interface SesionRepo extends JpaRepository<Sesion, Long> {
      @Query("""
                  select s
                  from Sesion s
                  join s.historia h
                  where h.empleado.id = :empleadoId
                    and s.fecha >= :ini and s.fecha < :fin
                  """)
      List<Sesion> findByEmpleadoAndRango(
                  @Param("empleadoId") Long empleadoId,
                  @Param("ini") LocalDateTime ini,
                  @Param("fin") LocalDateTime fin);
}
