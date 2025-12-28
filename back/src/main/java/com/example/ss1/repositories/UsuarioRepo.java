package com.example.ss1.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ss1.enums.Rol;
import com.example.ss1.models.Usuario;

public interface UsuarioRepo extends JpaRepository<Usuario,Long>{
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByCodigoVerificacion(String codigo);
    List<Usuario> findAllByRol(Rol rol);
}
