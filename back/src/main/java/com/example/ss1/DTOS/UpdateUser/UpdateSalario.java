package com.example.ss1.DTOS.UpdateUser;

public class UpdateSalario {
    private Long id;
    private double salario;
    private double bono;
    private boolean aplicaIgss;
    
    public double getBono() {
        return bono;
    }
    public void setBono(double bono) {
        this.bono = bono;
    }
    public boolean isAplicaIgss() {
        return aplicaIgss;
    }
    public void setAplicaIgss(boolean aplicaIgss) {
        this.aplicaIgss = aplicaIgss;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public double getSalario() {
        return salario;
    }
    public void setSalario(double salario) {
        this.salario = salario;
    }
    
}
