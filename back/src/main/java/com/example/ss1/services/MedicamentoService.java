package com.example.ss1.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.ss1.errors.ApiException;
import com.example.ss1.models.Medicamentos.Medicamento;
import com.example.ss1.repositories.Medicamento.MedicamentoRepo;

@Service
public class MedicamentoService {
    @Autowired
    private MedicamentoRepo medicamentoRepo;

    public void save(Medicamento medicamento){
        medicamentoRepo.save(medicamento);
    }

    public Medicamento findById(Long id){
        return medicamentoRepo.findById(id)
        .orElseThrow(()-> new ApiException("Medicamento no encontrado", HttpStatus.NOT_FOUND));
    }

    public void actualizarStock(Long id, int nuevo){
        if(nuevo<=0)
            throw new ApiException("El valor no puede ser negativo", HttpStatus.BAD_REQUEST);
        Medicamento medicamento = findById(id);
        medicamento.setStock(medicamento.getStock() + nuevo);
        medicamentoRepo.save(medicamento);
    }

    public List<Medicamento> findAll(){
        return medicamentoRepo.findAll();
    }
    

}
