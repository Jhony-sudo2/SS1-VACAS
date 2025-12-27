package com.example.ss1.services;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.ss1.DTOS.CompraDTO.CompraDTO;
import com.example.ss1.DTOS.CompraDTO.ResponseReceta;
import com.example.ss1.DTOS.CompraDTO.CompraDTO.Detalle;
import com.example.ss1.enums.Estado;
import com.example.ss1.errors.ApiException;
import com.example.ss1.models.Empresa;
import com.example.ss1.models.Paciente;
import com.example.ss1.models.Cita.Cita;
import com.example.ss1.models.Cita.Receta;
import com.example.ss1.models.Cita.Sesion;
import com.example.ss1.models.Medicamentos.Medicamento;
import com.example.ss1.models.Pagos.DetalleVenta;
import com.example.ss1.models.Pagos.PagoSesion;
import com.example.ss1.models.Pagos.Venta;
import com.example.ss1.repositories.EmpresaRepo;
import com.example.ss1.repositories.Cita.CitaRepo;
import com.example.ss1.repositories.Cita.RecetaRepo;
import com.example.ss1.repositories.Cita.SesionRepo;
import com.example.ss1.repositories.Medicamento.MedicamentoRepo;
import com.example.ss1.repositories.PagoRepo.DetalleVentaRepo;
import com.example.ss1.repositories.PagoRepo.PagoSesionRepo;
import com.example.ss1.repositories.PagoRepo.VentaRepo;

import jakarta.transaction.Transactional;

@Service
public class PagoService {
    @Autowired
    private MedicamentoRepo medicamentoRepo;
    @Autowired
    private DetalleVentaRepo detalleVentaRepo;
    @Autowired
    private PagoSesionRepo pagoSesionRepo;
    @Autowired
    private RecetaRepo recetaRepo;
    @Autowired
    private VentaRepo ventaRepo;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private MedicamentoService medicamentoService;
    @Autowired
    private EmpresaRepo empresaRepo;
    @Autowired
    private SesionRepo sesionRepo;
    @Autowired
    private CitaRepo citaRepo;

    public ArrayList<ResponseReceta> findMedicamentosxReceta(Long sesionId){
        List<Receta> recetas = recetaRepo.findAllBySesion(sesionId);
        ArrayList<ResponseReceta> response = new ArrayList<>();
        for (Receta tmpReceta : recetas) {
            ResponseReceta nuevo = new ResponseReceta();
            nuevo.setMedicamento(tmpReceta.getMedicamento());
            nuevo.setCantidad(tmpReceta.getCantidad());
            response.add(nuevo);
        }
        return response;
    }

    public void ComprarconReceta(List<Long> recetasId,String tarjeta,String codigo,YearMonth fechaVencimiento,boolean tipo){
        ArrayList<Medicamento> medicamentos = new ArrayList<>();
        ArrayList<DetalleVenta> detalleVentas = new ArrayList<>();
        Paciente paciente = new Paciente();
        double total = 0;
        for (Long tmp : recetasId) {
            Receta receta = recetaRepo.findById(tmp)
            .orElseThrow(()-> new ApiException("Receta no encontrada", HttpStatus.NOT_FOUND));
            Medicamento medicamento = medicamentoService.findById(receta.getMedicamento().getId());
            if(medicamento.getStock() < receta.getCantidad())
                throw new ApiException("Medicamento sin suficiente stock", HttpStatus.BAD_REQUEST);
            medicamento.setStock(medicamento.getStock() - receta.getCantidad());
            medicamentos.add(medicamento);
            DetalleVenta detalle = new DetalleVenta();
            detalle.setCantidad(receta.getCantidad());
            detalle.setMedicamento(medicamento);
            total += medicamento.getPrecio();
            paciente = receta.getPaciente();
        }
        medicamentoRepo.saveAll(medicamentos);
        Venta venta = new Venta();
        venta.setPaciente(paciente);
        venta.setTotal(total);
        if(tipo){
            venta.setCodigo(codigo);
            venta.setTarjeta(tarjeta);
            venta.setFechaVencimiento(fechaVencimiento);
            venta.setEstadoEntrega(false);
        }else
            venta.setEstadoEntrega(true);
        venta.setFecha(LocalDate.now());

        Venta venta2 = ventaRepo.save(venta);
        for (DetalleVenta detalleVenta : detalleVentas) {
            detalleVenta.setFactura(venta2);
            detalleVentaRepo.save(detalleVenta);
        }
    }

    

    @Transactional
    public void comprarSinReceta(CompraDTO compra){
        Paciente paciente = usuarioService.findPacienteByUsuarioId(compra.getPacienteId());
        double total = 0;
        ArrayList<DetalleVenta> detalleVentas = new ArrayList<>();
        for (Detalle tmpDetalle : compra.getDetalle()) {
            Medicamento medicamento = medicamentoService.findById(tmpDetalle.getMedicamentoId());
            if (medicamento.getStock() < tmpDetalle.getCantidad()) 
                throw new ApiException("STOCK NO SUFICIENTE", HttpStatus.BAD_REQUEST);
            medicamento.setStock(medicamento.getStock() - tmpDetalle.getCantidad());
            total += medicamento.getPrecio() * tmpDetalle.getCantidad();
            medicamentoRepo.save(medicamento);
            DetalleVenta detalleVenta = new DetalleVenta();
            detalleVenta.setCantidad(tmpDetalle.getCantidad());
            detalleVenta.setMedicamento(medicamento);
            detalleVentas.add(detalleVenta);
        }
        Venta venta = new Venta();
        venta.setPaciente(paciente);
        venta.setTotal(total);
        if (compra.isTipo()) {
            venta.setFechaVencimiento(compra.getFechaVencimiento());
            venta.setCodigo(compra.getCodigo());
            venta.setTarjeta(compra.getTarjeta());
            venta.setEstadoEntrega(false);
        }else
            venta.setEstadoEntrega(true);
        venta.setFecha(LocalDate.now());
        Venta venta2 = ventaRepo.save(venta);
        for (DetalleVenta detalleVenta : detalleVentas) {
            detalleVenta.setFactura(venta2);
            detalleVentaRepo.save(detalleVenta);
        }

    }

    public void entregarVenta(Long idVenta){
        Venta venta = ventaRepo.findById(idVenta)
        .orElseThrow(()-> new ApiException("Venta no existente", HttpStatus.NOT_FOUND));
        venta.setEstadoEntrega(true);
        ventaRepo.save(venta);
    }

    public List<Venta> misVentas(Long id){
        Long pacienteId = usuarioService.findPacienteByUsuarioId(id).getId();
        return ventaRepo.findAllByPacienteId(pacienteId);
    }

    public Venta findVentaById(Long id){
        return ventaRepo.findById(id)
        .orElseThrow(()-> new ApiException("Venta no existe", HttpStatus.NOT_FOUND));
    }

    public List<PagoSesion> misPagosSesion(Long id){
        Long idPaciente = usuarioService.findPacienteByUsuarioId(id).getId();
        List<PagoSesion> sesion1 = pagoSesionRepo.findAllByCita_PacienteId(idPaciente);
        List<PagoSesion> sesion2 = pagoSesionRepo.findAllBySesion_Historia_PacienteId(idPaciente); 
        sesion1.addAll(sesion2); 
        return sesion1;
    }

    public void PagarSesion(PagoSesion pagoSesion){
        double total = 0;
        if (pagoSesion.getCita() == null) {
            total = pagoSesion.getSesion().getHistoria().getCostoSesion(); 
            Sesion sesion = pagoSesion.getSesion();
            sesion.setEstado(Estado.PAGADA);
            sesion.setEstadoPago(true);
            sesionRepo.save(sesion);
        }
        else{
            Empresa empresa = empresaRepo.findById(1L)
            .orElseThrow(()-> new ApiException("Datos de empresa no cargados", HttpStatus.NOT_FOUND));
            total = empresa.getPrecioCita();
            Cita cita = pagoSesion.getCita();
            cita.setEstado(Estado.PAGADA);
            citaRepo.save(cita);
        }
        pagoSesion.setTotal(total);
        pagoSesion.setFecha(LocalDate.now());
        pagoSesionRepo.save(pagoSesion);
    }

    public List<Venta> findAllVentas(){
        return ventaRepo.findAll();
    }

    public ArrayList<ResponseReceta> findDetalleVentas(Long idVenta){
        ArrayList<ResponseReceta> response = new ArrayList<>();
        Venta venta = findVentaById(idVenta);
        List<DetalleVenta> detalle = detalleVentaRepo.findAllByFacturaId(venta.getId());
        for (DetalleVenta detalleVenta : detalle) {
            ResponseReceta nuevo = new ResponseReceta();
            nuevo.setMedicamento(detalleVenta.getMedicamento());
            nuevo.setCantidad(detalleVenta.getCantidad());
            response.add(nuevo);
        }
        return response;
    }
    


}
