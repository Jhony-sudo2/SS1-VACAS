package com.example.ss1.DTOS.CitaDTO;

import com.example.ss1.enums.Estado;

public class UpdateState {
    private Long id;
    private Estado estado;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Estado getEstado() {
        return estado;
    }
    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    
}
