package com.example.ss1.repositories.Cita;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ss1.enums.Estado;
import com.example.ss1.models.Cita.Cita;

public interface CitaRepo extends JpaRepository<Cita, Long> {
       @Query("""
                     select c
                     from Cita c
                     where c.empleado.id = :empleadoId
                       and c.estado <> com.example.ss1.enums.Estado.CANCELADA
                       and c.fecha >= :ini and c.fecha < :fin
                     """)
       List<Cita> findOcupadasByEmpleadoAndRango(
                     @Param("empleadoId") Long empleadoId,
                     @Param("ini") LocalDateTime ini,
                     @Param("fin") LocalDateTime fin);

      
       @Query("""
                     select (count(c) > 0)
                     from Cita c
                     where c.empleado.id = :empleadoId
                       and c.estado <> com.example.ss1.enums.Estado.CANCELADA
                       and c.fecha >= :desde and c.fecha <= :hasta
                     """)
       boolean existsCitaSolapadaDuracionFija(
                     @Param("empleadoId") Long empleadoId,
                     @Param("desde") LocalDateTime desde,
                     @Param("hasta") LocalDateTime hasta);

      List<Cita> findAllByEmpleadoId(Long empleadoId);
      List<Cita> findAllByPacienteId(Long pacienteId);
      List<Cita> findAllByEmpleadoIdAndEstado(Long PacienteId,Estado estado);
}
