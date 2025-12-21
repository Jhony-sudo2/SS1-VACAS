import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/Auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
type LoginStep = 'CREDENCIALES' | 'A2F';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  currentYear = new Date().getFullYear();  
  loginForm!: FormGroup;
  codigoForm!: FormGroup;

  step: LoginStep = 'CREDENCIALES';
  pendingEmail: string | null = null;
  infoMessage: string | null = null;

  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.codigoForm = this.fb.group({
      codigo: ['', [Validators.required]]
    });
  }

  onSubmitLogin(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loading = true;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.loading = false;

        // CASO: se requiere A2F (no hay token, pero hay flag/mensaje)
        if (!res.accessToken) {
          this.step = 'A2F';
          this.pendingEmail = email;
          this.mensajeOk('se ha enviado un codigo a tu correo electronico')
          return;
        }

        if (res.accessToken && res.user) {
          this.router.navigate(['/']);
          return;
        }

        // Cualquier otro caso raro:
        this.errorMessage =  'No se pudo iniciar sesión.';
      },
      error: (err) => {
        this.loading = false;
        this.error(err.error)
      }
    });
  }

  onSubmitCodigo(): void {
    this.errorMessage = null;

    if (this.codigoForm.invalid || !this.pendingEmail) {
      this.codigoForm.markAllAsTouched();
      return;
    }

    const { codigo } = this.codigoForm.value;
    this.loading = true;

    this.authService.confirmarCorreo(this.pendingEmail, codigo).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.accessToken && res.user) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage  || 'No se pudo confirmar el código.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error(err.error)
      }
    });
  }

  volverAlPrimerPaso(): void {
    this.step = 'CREDENCIALES';
    this.codigoForm.reset();
    this.pendingEmail = null;
    this.infoMessage = null;
  }
  onForgotPassword(){}

  error(mensaje:any){
    Swal.fire({title:'error',text:mensaje,icon:'error'})
  }
  mensajeOk(mensaje:any){
    Swal.fire({title:'OK',text:mensaje,icon:'success'})
  }
}
