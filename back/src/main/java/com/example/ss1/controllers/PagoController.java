package com.example.ss1.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.UpdateEstado;
import com.example.ss1.DTOS.CompraDTO.CompraDTO;
import com.example.ss1.DTOS.CompraDTO.ResponseReceta;
import com.example.ss1.models.Pagos.PagoSesion;
import com.example.ss1.models.Pagos.Venta;
import com.example.ss1.services.PagoService;

@RestController
@RequestMapping("/compra")
public class PagoController {
    @Autowired
    private PagoService pagoService;

    @GetMapping("/receta")
    public ArrayList<ResponseReceta> compraconReceta(@RequestParam Long id){
        return pagoService.findMedicamentosxReceta(id);
    }

    @PostMapping("/normal")
    public void compraNormal(@RequestBody CompraDTO data){
        pagoService.comprarSinReceta(data);
    }

    @PostMapping("/entregar")
    public void  entregarVenta(@RequestBody UpdateEstado data){
        pagoService.entregarVenta(data.getId());
    }

    @GetMapping("/venta")
    public List<Venta> getMisVentas(@RequestParam Long id){
        return pagoService.misVentas(id);
    }

    @GetMapping("/ventas")
    public List<Venta> allVentas(){
        return pagoService.findAllVentas();
    }

    @GetMapping("/venta/detalle")
    public List<ResponseReceta> getDetalleVenta(@RequestParam Long id){
        return pagoService.findDetalleVentas(id);
    }

    @GetMapping("/venta/id")
    public Venta findById(@RequestParam Long id){
        return pagoService.findVentaById(id);
    }

    @PostMapping("/sesion")
    public void PagarSesion(@RequestBody PagoSesion pagoSesion){
        pagoService.PagarSesion(pagoSesion);
    }

    @GetMapping("/sesion")
    public List<PagoSesion> getSesiones(@RequestParam Long id){
        return pagoService.misPagosSesion(id);
    }


}
