package com.example.ss1.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.ss1.DTOS.PrincipalDTO;
import com.example.ss1.errors.ApiException;
import com.example.ss1.models.Empresa;
import com.example.ss1.models.Servicio;
import com.example.ss1.models.EmpleadoR.Area;
import com.example.ss1.repositories.AreaRepo;
import com.example.ss1.repositories.EmpresaRepo;
import com.example.ss1.repositories.ServicioRepo;
import com.example.ss1.repositories.Medicamento.MedicamentoRepo;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepo empresaRepo;
    @Autowired
    private AzureService azureService;
    @Autowired
    private ServicioRepo servicioRepo;
    @Autowired
    private AreaRepo areaRepo;
    @Autowired
    private MedicamentoRepo medicamentoRepo;

    public Empresa getEmpresaData(){
        return empresaRepo.findById(1L).
        orElseThrow(()-> new ApiException("Datos de empresa no cargadaso", HttpStatus.NOT_FOUND));
    }

    public void updateEmpresa(Empresa empresa){
        String imagen = azureService.uploadBase64(empresa.getImagen(), "IMAGEN", null);
        empresa.setImagen(imagen);
        empresaRepo.save(empresa);
    }

    public PrincipalDTO getPrincipalEmpleado(){
        Empresa empresa = getEmpresaData();
        List<Servicio> servicios = servicioRepo.findAll();
        List<Area> areas = areaRepo.findAll();
        return new PrincipalDTO(empresa, areas, servicios,medicamentoRepo.findAll());
    }
}
