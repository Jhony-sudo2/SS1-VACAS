package com.example.ss1.DTOS;

import com.example.ss1.enums.Rol;

public class UserDto {
    private Long id;
    private String email;
    private Rol rol;

    public UserDto(){}
    public UserDto(Long id, String email, Rol rol) {
        this.id = id;
        this.email = email;
        this.rol = rol;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Rol getRol() {
        return rol;
    }
    public void setRol(Rol rol) {
        this.rol = rol;
    }

    
}
