package com.example.ss1.configs;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.ss1.enums.Rol;
import com.example.ss1.models.Empleado;
import com.example.ss1.models.Empresa;
import com.example.ss1.models.Usuario;
import com.example.ss1.repositories.EmpleadoRepo;
import com.example.ss1.repositories.EmpresaRepo;
import com.example.ss1.repositories.UsuarioRepo;

@Component
public class Seeders implements CommandLineRunner{
    @Autowired
    private PasswordEncoder passwordEncoder;
    private final EmpresaRepo empresaRepo;
    private final UsuarioRepo usuarioRepo;
    private final EmpleadoRepo empleadoRepo;
    public Seeders(EmpresaRepo empresaRepo,UsuarioRepo usuarioRepo,EmpleadoRepo empleadoRepo){
        this.empresaRepo = empresaRepo;
        this.usuarioRepo = usuarioRepo;
        this.empleadoRepo = empleadoRepo;
    }

    @Override
    public void run(String... args){
        if(empresaRepo.count() ==0){
            Empresa empresa = new Empresa();
            empresa.setNombre("Empresa");
            empresa.setTiempoCita(45);
            empresa.setPrecioCita(75);
            empresaRepo.save(empresa);
        }
        if(usuarioRepo.count() == 0){
           
            Usuario usuario = new Usuario();
            usuario.setEmail("jhony.fuentes19@gmail.com");
            usuario.setRol(Rol.ADMIN);
            usuario.setEmailVerificado(true);
            usuario.setA2f(false);
            usuario.setPassword(passwordEncoder.encode("admin12345"));
            Usuario usuario2 = usuarioRepo.save(usuario);
            Empleado empleado = new Empleado();
            empleado.setNombre("Administrador");
            empleado.setFechaNacimiento(LocalDate.now());
            empleado.setTelefono("42882130");
            empleado.setUsuario(usuario2);
            empleadoRepo.save(empleado);
        }
    }
}
