package com.example.ss1.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ss1.PrimariasCompuestas.ServicioArea;
import com.example.ss1.models.AsignacionServicio;
import com.example.ss1.models.EmpleadoR.Area;

public interface AsignacionServicioRepo extends JpaRepository<AsignacionServicio,ServicioArea>{
    List<AsignacionServicio> findAllByServicioId(Long servicioId);
     @Query("select distinct a.area.id from AsignacionServicio a where a.servicio.id = :servicioId")
    List<Long> findDistinctAreaIdsByServicioId(@Param("servicioId") Long servicioId);

    @Query("select distinct a.area from AsignacionServicio a where a.servicio.id = :servicioId")
    List<Area> findDistinctAreasByServicioId(@Param("servicioId") Long servicioId);

    List<AsignacionServicio> findAllByAreaId(Long areaId);
}
