package com.example.ss1.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.ss1.errors.ApiException;
import com.example.ss1.models.Empresa;
import com.example.ss1.repositories.EmpresaRepo;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepo empresaRepo;
    @Autowired
    private AzureService azureService;

    public Empresa getEmpresaData(){
        return empresaRepo.findById(1L).
        orElseThrow(()-> new ApiException("Datos de empresa no cargadaso", HttpStatus.NOT_FOUND));
    }

    public void updateEmpresa(Empresa empresa){
        String imagen = azureService.uploadBase64(empresa.getImagen(), "IMAGEN", null);
        empresa.setImagen(imagen);
        empresaRepo.save(empresa);
    }

}
