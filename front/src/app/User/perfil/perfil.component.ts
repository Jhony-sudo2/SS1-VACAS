import { Component } from '@angular/core';
import { UserService } from '../../services/User/user.service';
import { AuthService } from '../../services/Auth/auth.service';
import { Empleado, Paciente, Rol } from '../../interfaces/Usuario';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  rol!: Rol;
  usuarioId = 0;
  Rol = Rol
  empleado: Empleado = { id: undefined } as Empleado;
  paciente: Paciente = { id: undefined } as Paciente;

  // ui
  cargando = false;
  guardando = false;
  cambiandoPass = false;

  // password
  actual = '';
  nueva = '';
  confirmNueva = '';

  constructor(private servicio: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario?.id) return;

    this.usuarioId = usuario.id;
    this.rol = usuario.rol;

    this.cargarPerfil();
  }

  private cargarPerfil(): void {
    this.cargando = true;

    if (this.rol === Rol.PACIENTE) {
      this.servicio.getPaciente(this.usuarioId).subscribe({
        next: (response) => (this.paciente = response),
        error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cargar paciente', icon: 'error' }),
        complete: () => (this.cargando = false)
      });
    } else {
      this.servicio.getEmpleado(this.usuarioId).subscribe({
        next: (response) => (this.empleado = response),
        error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cargar empleado', icon: 'error' }),
        complete: () => (this.cargando = false)
      });
    }
  }

  toInputDate(v: any): string {
    if (!v) return '';
    const d = new Date(v);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  fromInputDate(s: string): Date {
    return new Date(`${s}T00:00:00`);
  }

  get email(): string {
    if (this.rol === Rol.PACIENTE) return this.paciente?.usuario?.email || '';
    return this.empleado?.usuario?.email || '';
  }

  actualizarDatos(): void {
    if (!this.usuarioId) return;

    if (this.rol === Rol.PACIENTE) {
      const p = this.paciente;

      const nombre = (p?.nombre || '').trim();
      if (!nombre) {
        Swal.fire({ title: 'Validación', text: 'El nombre es requerido.', icon: 'warning' });
        return;
      }

      this.guardando = true;
      this.servicio.updatePaciente(p).subscribe({
        next: () => Swal.fire({ title: 'OK', text: 'Perfil actualizado.', icon: 'success' }),
        error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo actualizar', icon: 'error' }),
        complete: () => (this.guardando = false)
      });
    } else {
      const e = this.empleado;

      const nombre = (e?.nombre || '').trim();
      if (!nombre) {
        Swal.fire({ title: 'Validación', text: 'El nombre es requerido.', icon: 'warning' });
        return;
      }

      this.guardando = true;
      this.servicio.updateEmpleado(e).subscribe({
        next: () => Swal.fire({ title: 'OK', text: 'Perfil actualizado.', icon: 'success' }),
        error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo actualizar', icon: 'error' }),
        complete: () => (this.guardando = false)
      });
    }
  }

  cambiarContrasenia(): void {
    const actual = (this.actual || '').trim();
    const nueva = (this.nueva || '').trim();
    const conf = (this.confirmNueva || '').trim();

    if (!actual || !nueva) {
      Swal.fire({ title: 'Validación', text: 'Ingresa la contraseña actual y la nueva.', icon: 'warning' });
      return;
    }
    if (nueva.length < 6) {
      Swal.fire({ title: 'Validación', text: 'La nueva contraseña debe tener al menos 6 caracteres.', icon: 'warning' });
      return;
    }
    if (nueva !== conf) {
      Swal.fire({ title: 'Validación', text: 'La confirmación no coincide.', icon: 'warning' });
      return;
    }

    this.cambiandoPass = true;
    this.servicio.updatePassword(this.usuarioId, actual, nueva).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Contraseña actualizada.', icon: 'success' });
        this.actual = '';
        this.nueva = '';
        this.confirmNueva = '';
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cambiar la contraseña', icon: 'error' }),
      complete: () => (this.cambiandoPass = false)
    });
  }
  toggleA2fPacienteEvent(ev: Event): void {
    const input = ev.target as HTMLInputElement | null;
    const checked = !!input?.checked;
    if (!this.paciente?.usuario) return;
    this.paciente.usuario.a2f = checked;
  }

  toggleA2fEmpleadoEvent(ev: Event): void {
    const input = ev.target as HTMLInputElement | null;
    const checked = !!input?.checked;
    if (!this.empleado?.usuario) return;
    this.empleado.usuario.a2f = checked;
  }
}
