package com.example.ss1.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ss1.PrimariasCompuestas.EmpleadoArea;
import com.example.ss1.models.Empleado;
import com.example.ss1.models.EmpleadoR.AsignacionArea;

public interface AsignacionAreaRepo extends JpaRepository<AsignacionArea,EmpleadoArea>{
    List<AsignacionArea> findAllByEmpleadoId(Long empleadoId);
    List<AsignacionArea> findAllByAreaId(Long areaId);
    @Query("select distinct aa.empleado from AsignacionArea aa where aa.area.id in :areaIds")
    List<Empleado> findDistinctEmpleadosByAreaIds(@Param("areaIds") List<Long> areaIds);
}
