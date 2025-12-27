import { Component } from '@angular/core';
import { UserService } from '../../services/User/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

type Paso = 1 | 2 | 3;

@Component({
  selector: 'app-recupear-contrasenia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recupear-contrasenia.component.html',
  styleUrl: './recupear-contrasenia.component.css'
})
export class RecupearContraseniaComponent  {
  paso: Paso = 1;

  email = '';
  codigo = '';
  nueva = '';
  confirmNueva = '';

  

  constructor(private servicio: UserService) { }

  ngOnInit(): void { }

  private isEmailValido(e: string): boolean {
    const s = (e || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }

  enviarCodigo(): void {
    const email = (this.email || '').trim().toLowerCase();

    if (!this.isEmailValido(email)) {
      Swal.fire({ title: 'Validación', text: 'Ingresa un correo válido.', icon: 'warning' });
      return;
    }

   
    this.servicio.recupearContrasenia(email).subscribe({
      next: () => {
        Swal.fire({ title: 'Listo', text: 'Se envió un código a tu correo.', icon: 'success' });
        this.paso = 2;
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo enviar el correo', icon: 'error' }),
      
    });
  }

  confirmarCodigo(): void {
    const email = (this.email || '').trim().toLowerCase();
    const codigo = (this.codigo || '').trim();

    if (!this.isEmailValido(email)) {
      Swal.fire({ title: 'Validación', text: 'Ingresa un correo válido.', icon: 'warning' });
      return;
    }
    if (!codigo) {
      Swal.fire({ title: 'Validación', text: 'Ingresa el código.', icon: 'warning' });
      return;
    }

    
    this.servicio.confirmarCodigo(email, codigo).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Código verificado. Ahora ingresa tu nueva contraseña.', icon: 'success' });
        this.paso = 3;
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'Código inválido', icon: 'error' }),
      
    });
  }

  cambiarContrasenia(): void {
    const email = (this.email || '').trim().toLowerCase();
    const nueva = (this.nueva || '').trim();
    const conf = (this.confirmNueva || '').trim();

    if (!this.isEmailValido(email)) {
      Swal.fire({ title: 'Validación', text: 'Ingresa un correo válido.', icon: 'warning' });
      return;
    }
    if (!nueva) {
      Swal.fire({ title: 'Validación', text: 'Ingresa la nueva contraseña.', icon: 'warning' });
      return;
    }
    if (nueva.length < 6) {
      Swal.fire({ title: 'Validación', text: 'La contraseña debe tener al menos 6 caracteres.', icon: 'warning' });
      return;
    }
    if (nueva !== conf) {
      Swal.fire({ title: 'Validación', text: 'La confirmación no coincide.', icon: 'warning' });
      return;
    }

    
    this.servicio.cambiarContrasenia(email, nueva).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Contraseña actualizada correctamente.', icon: 'success' });
        this.reset();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cambiar la contraseña', icon: 'error' }),
      
    });
  }

  reenviarCodigo(): void {
    // Reutiliza el paso 1 sin borrar email
    this.codigo = '';
    this.paso = 1;
    this.enviarCodigo();
  }

  volver(): void {
    if (this.paso === 3) this.paso = 2;
    else if (this.paso === 2) this.paso = 1;
  }

  reset(): void {
    this.paso = 1;
    this.email = '';
    this.codigo = '';
    this.nueva = '';
    this.confirmNueva = '';
    
  }
}
