package com.example.ss1.DTOS.UpdateUser;

public class UpdatePassword {
    private Long usuarioId;
    private String actual;
    private String nueva;
    public Long getUsuarioId() {
        return usuarioId;
    }
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    public String getActual() {
        return actual;
    }
    public void setActual(String actual) {
        this.actual = actual;
    }
    public String getNueva() {
        return nueva;
    }
    public void setNueva(String nueva) {
        this.nueva = nueva;
    }
    
}
