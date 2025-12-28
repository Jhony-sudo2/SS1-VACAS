package com.example.ss1.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.ReportesDTO.AtencionEmpleadoDTO;
import com.example.ss1.DTOS.ReportesDTO.ReporteFinancieroDTO;
import com.example.ss1.DTOS.ReportesDTO.TopMedicamentoDTO;
import com.example.ss1.models.Medicamentos.Medicamento;
import com.example.ss1.models.Pagos.Venta;
import com.example.ss1.services.ReporteService;

@RestController()
@RequestMapping("/reportes")
public class ReporteController {
    @Autowired
    private ReporteService reporteService;

    // -----------------------------
    // Reporte financiero
    // -----------------------------
    // GET /reportes/financieros?desde=2025-01-01&hasta=2025-01-31
    @GetMapping("/financieros")
    public ResponseEntity<ReporteFinancieroDTO> financiero(
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(reporteService.reporteFinanciero(desde, hasta));
    }

    // -----------------------------
    // Reportes de inventario
    // -----------------------------
    // GET /reportes/inventario/minimos
    @GetMapping("/inventario/minimos")
    public ResponseEntity<List<Medicamento>> medicamentosEnMinimo() {
        return ResponseEntity.ok(reporteService.medicamentosEnMinimo());
    }

    // GET /reportes/inventario/ventas?desde=2025-01-01&hasta=2025-01-31
    @GetMapping("/inventario/ventas")
    public ResponseEntity<List<Venta>> historialVentas(
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(reporteService.historialVentas(desde, hasta));
    }

    // GET
    // /reportes/inventario/top-medicamentos?desde=2025-01-01&hasta=2025-01-31&top=10
    @GetMapping("/inventario/top-medicamentos")
    public ResponseEntity<List<TopMedicamentoDTO>> topMedicamentos(
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate hasta,
            @RequestParam(defaultValue = "10") int top) {
        return ResponseEntity.ok(reporteService.topMedicamentosVendidos(desde, hasta, top));
    }

    // -----------------------------
    // Reportes clínicos agregados
    // -----------------------------
    // GET
    // /reportes/clinicos/atencion-por-empleado?desde=2025-01-01&hasta=2025-01-31
    @GetMapping("/clinicos/atencion-por-empleado")
    public ResponseEntity<List<AtencionEmpleadoDTO>> atencionPorEmpleado(
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(reporteService.estadisticasAtencionPorEmpleado(desde, hasta));
    }

    // -----------------------------
    // RRHH (base)
    // -----------------------------
    // GET /reportes/rrhh/costo-nomina?desde=2025-01-01&hasta=2025-03-31
    @GetMapping("/rrhh/costo-nomina")
    public ResponseEntity<Double> costoNomina(
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(reporteService.costoNominaEstimado(desde, hasta));
    }
}
