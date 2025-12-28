package com.example.ss1.services;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.ss1.DTOS.ReportesDTO.AtencionEmpleadoDTO;
import com.example.ss1.DTOS.ReportesDTO.ReporteFinancieroDTO;
import com.example.ss1.DTOS.ReportesDTO.TopMedicamentoDTO;
import com.example.ss1.models.Medicamentos.Medicamento;
import com.example.ss1.models.Pagos.Venta;
import com.example.ss1.repositories.EmpleadoRepo;
import com.example.ss1.repositories.Medicamento.MedicamentoRepo;
import com.example.ss1.repositories.PagoRepo.DetalleVentaRepo;
import com.example.ss1.repositories.PagoRepo.PagoSesionRepo;
import com.example.ss1.repositories.PagoRepo.VentaRepo;

@Service
public class ReporteService {
    @Autowired
    private VentaRepo ventaRepo;
    @Autowired
    private PagoSesionRepo pagoSesionRepo;
    @Autowired
    private DetalleVentaRepo detalleVentaRepo;
    @Autowired
    private MedicamentoRepo medicamentoRepo;
    @Autowired
    private EmpleadoRepo empleadoRepo;

    // -------------------------------
    // 1) Reportes financieros
    // -------------------------------
    public ReporteFinancieroDTO reporteFinanciero(LocalDate desde, LocalDate hasta) {
        double ingresosVentas = safe(ventaRepo.sumTotalBetween(desde, hasta));
        double ingresosSesiones = safe(pagoSesionRepo.sumTotalBetween(desde, hasta));

        // costo nómina estimado (simple): suma de sueldos * cantidad de meses en el
        // periodo
        double sumaSueldosMensual = safe(empleadoRepo.sumSueldos());
        long meses = mesesIncluyentes(desde, hasta);
        double costoNomina = sumaSueldosMensual * meses;

        return new ReporteFinancieroDTO(ingresosVentas, ingresosSesiones, costoNomina);
    }

    // -------------------------------
    // 2) Reportes de inventario
    // -------------------------------
    public List<Medicamento> medicamentosEnMinimo() {
        return medicamentoRepo.findEnMinimo();
    }

    // Historial ventas en periodo
    public List<Venta> historialVentas(LocalDate desde, LocalDate hasta) {
        return ventaRepo.findAllByFechaBetween(desde, hasta);
    }

    // Top medicamentos vendidos en periodo
    public List<TopMedicamentoDTO> topMedicamentosVendidos(LocalDate desde, LocalDate hasta, int top) {
        int limit = Math.max(1, Math.min(top, 50));
        return detalleVentaRepo.topMedicamentosVendidos(desde, hasta, PageRequest.of(0, limit));
    }

    // -------------------------------
    // 3) Reportes clínicos agregados
    // -------------------------------
    // Estadísticas de atención por "área"
    // (aquí lo dejo por EMPLEADO que atendió la CITA, porque no tienes Area en
    // Cita/Empleado)
    public List<AtencionEmpleadoDTO> estadisticasAtencionPorEmpleado(LocalDate desde, LocalDate hasta) {
        return pagoSesionRepo.estadisticasAtencionPorEmpleado(desde, hasta);
    }

    // -------------------------------
    // 4) Reportes RRHH (base)
    // -------------------------------
    // Con tu modelo actual NO existe tabla de pagos nómina/bonos/retenciones.
    // Aquí solo te doy “costo nómina estimado” (sueldos * meses).
    public double costoNominaEstimado(LocalDate desde, LocalDate hasta) {
        double sumaSueldosMensual = safe(empleadoRepo.sumSueldos());
        return sumaSueldosMensual * mesesIncluyentes(desde, hasta);
    }

    private double safe(Double v) {
        return v == null ? 0.0 : v.doubleValue();
    }

    // Cuenta meses incluyentes. Ej: 2025-01-01 a 2025-01-31 -> 1 mes
    private long mesesIncluyentes(LocalDate desde, LocalDate hasta) {
        YearMonth a = YearMonth.from(desde);
        YearMonth b = YearMonth.from(hasta);
        long diff = ChronoUnit.MONTHS.between(a, b);
        return diff + 1; // incluyente
    }

}
