package com.example.ss1.repositories.Cita;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

       /**
        * Para AGENDAR con duración fija (D minutos):
        * Si todas las citas duran lo mismo, dos citas se solapan si |t1 - t2| < D.
        * Entonces basta buscar si existe alguna cita en (fecha - (D-1)) .. (fecha +
        * (D-1)).
        */
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
}
