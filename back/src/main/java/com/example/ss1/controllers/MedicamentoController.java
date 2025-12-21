package com.example.ss1.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ss1.DTOS.UpdateStock;
import com.example.ss1.models.Medicamentos.Medicamento;
import com.example.ss1.services.MedicamentoService;

@RestController
@RequestMapping("/medicamento")
public class MedicamentoController {
    @Autowired
    private MedicamentoService medicamentoService;

    @PostMapping()
    public void saveMedicamento(@RequestBody Medicamento medicamento){
         medicamentoService.save(medicamento);
    }

    @GetMapping()
    public List<Medicamento> findAll(){
        return medicamentoService.findAll();
    }

    @GetMapping("/id")
    public Medicamento findById(@RequestParam Long id){
        return medicamentoService.findById(id);
    }

    @PutMapping("/stock")
    public void updateStock(@RequestBody UpdateStock data){
        medicamentoService.actualizarStock(data.getId(), data.getCantidad());
    }

}
