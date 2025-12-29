import { Component } from '@angular/core';
import { UserService } from '../../services/User/user.service';
import { Paciente, Rol, Usuario } from '../../interfaces/Usuario';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-paciente',
  imports: [CommonModule,FormsModule],
  templateUrl: './crear-paciente.component.html',
  styleUrl: './crear-paciente.component.css'
})
export class CrearPacienteComponent  {

  usuario: Usuario = {
    id: undefined,
    email: '',
    password: '',
    rol: Rol.PACIENTE,      
    a2f: false,
    estado: true
  };

  // FORM PACIENTE
  paciente: any = {
    id: undefined,
    nombre: '',
    fechaNacimiento: '', 
    genero: true,      
    estadoCivil: true,   
    direccion: '',
    nivelEducativo: '',
    telefono: '',
    personaEmergencia: '',
    telefonoEmergencia: '',
    procedencia: '',
    usuario: undefined
  };

  // UI
  loadingCrear = false;
  loadingConfirm = false;

  modoConfirmacion = false;
  codigo = '';

  constructor(private servicio: UserService) {}

  ngOnInit(): void {}

  private isEmailValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
  }

  private validarCrear(): string | null {
    if (!this.usuario.email.trim()) return 'Ingresa el correo.';
    if (!this.isEmailValido(this.usuario.email)) return 'Correo inválido.';
    if (!this.usuario.password.trim()) return 'Ingresa la contraseña.';
    if (this.usuario.password.trim().length < 6) return 'La contraseña debe tener al menos 6 caracteres.';

    if (!this.paciente.nombre.trim()) return 'Ingresa el nombre del paciente.';
    if (!this.paciente.fechaNacimiento) return 'Selecciona la fecha de nacimiento.';
    if (!this.paciente.telefono.trim()) return 'Ingresa el teléfono.';
    if (!this.paciente.direccion.trim()) return 'Ingresa la dirección.';
    if (!this.paciente.nivelEducativo.trim()) return 'Ingresa el nivel educativo.';
    if (!this.paciente.personEmergencia.trim()) return 'Ingresa el contacto de emergencia.';
    if (!this.paciente.telefonoEmergencia.trim()) return 'Ingresa el teléfono de emergencia.';
    if (!this.paciente.procedencia.trim()) return 'Ingresa la procedencia.';

    return null;
  }

  crearPaciente(): void {
    const msg = this.validarCrear();
    if (msg) {
      Swal.fire({ title: 'Validación', text: msg, icon: 'warning' });
      return;
    }

    const fechaNac = new Date(this.paciente.fechaNacimiento + 'T00:00:00');

    const pacientePayload: Paciente = {
      id: undefined,
      nombre: this.paciente.nombre.trim(),
      fechaNacimiento: fechaNac,
      genero: !!this.paciente.genero,
      estadoCivil: !!this.paciente.estadoCivil,
      direccion: this.paciente.direccion.trim(),
      nivelEducativo: this.paciente.nivelEducativo.trim(),
      telefono: this.paciente.telefono.trim(),
      personaEmergencia: this.paciente.personEmergencia.trim(),
      telefonoEmergencia: this.paciente.telefonoEmergencia.trim(),
      procedencia: this.paciente.procedencia.trim(),
      usuario: undefined as any 
    };

    const usuarioPayload: Usuario = {
      id: undefined,
      email: this.usuario.email.trim(),
      password: this.usuario.password,
      rol: this.usuario.rol,      
      a2f: !!this.usuario.a2f,
      estado: !!this.usuario.estado
    };

    this.loadingCrear = true;

    this.servicio.createPaciente(usuarioPayload, pacientePayload).subscribe({
      next: () => {
        Swal.fire({
          title: 'Listo',
          text: 'Paciente creado. Revisa tu correo e ingresa el código de confirmación.',
          icon: 'success'
        });
        this.modoConfirmacion = true;
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err?.error || 'No se pudo crear el paciente.',
          icon: 'error'
        });
        this.loadingCrear = true
      },
      complete: () => (this.loadingCrear = false)
    });
  }

  confirmarCorreo(): void {
    const cod = (this.codigo || '').trim();
    if (!cod) {
      Swal.fire({ title: 'Validación', text: 'Ingresa el código.', icon: 'warning' });
      return;
    }

    this.loadingConfirm = true;
    this.servicio.confirmarCorreo(cod).subscribe({
      next: () => {
        Swal.fire({ title: 'Confirmado', text: 'Correo confirmado correctamente.', icon: 'success' });
        this.codigo = '';
        
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err?.error || 'Código inválido o expirado.',
          icon: 'error'
        });
      },
      complete: () => (this.loadingConfirm = false)
    });
  }

  volverAFormulario(): void {
    this.modoConfirmacion = false;
  }
}