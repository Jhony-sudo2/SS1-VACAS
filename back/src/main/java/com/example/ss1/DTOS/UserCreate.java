package com.example.ss1.DTOS;
import com.example.ss1.models.Usuario;

public class UserCreate {
    private Usuario usuario;
    private EmpleadoDTO empleado;
    private PacienteDTO paciente;
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    
    public EmpleadoDTO getEmpleado() {
        return empleado;
    }
    public void setEmpleado(EmpleadoDTO empleado) {
        this.empleado = empleado;
    }
    public PacienteDTO getPaciente() {
        return paciente;
    }
    public void setPaciente(PacienteDTO paciente) {
        this.paciente = paciente;
    }

    
}
