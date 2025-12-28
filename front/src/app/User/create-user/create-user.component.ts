import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/User/user.service';
import { Empleado, Usuario } from '../../interfaces/Usuario';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
type Step = 'FORM' | 'CONFIRM';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  form!: FormGroup;
  codigoForm!: FormGroup;

  step: Step = 'FORM';
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  pendingEmail: string | null = null; // por si quieres mostrarlo en el texto

  constructor(
    private fb: FormBuilder,
    private service: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      usuario: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        rol: ['EMPLEADO', Validators.required],
        a2f: [false],
        estado: [true],
      }),
      empleado: this.fb.group({
        nombre: ['', Validators.required],
        fechaNacimiento: ['', Validators.required],
        genero: [true, Validators.required],        // true = Masculino, false = Femenino
        estadoCivil: [false, Validators.required],  // false = Soltero, true = Casado
        telefono: ['', Validators.required],
        colegiado: ['', Validators.required],
        salario: [0, [Validators.required, Validators.min(0)]],
      }),
    });

    this.codigoForm = this.fb.group({
      codigo: ['', Validators.required],
    });
  }

  get usuarioGroup(): FormGroup {
    return this.form.get('usuario') as FormGroup;
  }

  get empleadoGroup(): FormGroup {
    return this.form.get('empleado') as FormGroup;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const usuarioForm = this.usuarioGroup.value;
    const empleadoForm = this.empleadoGroup.value;

    const usuario: Usuario = {
      id: null as any, // el back lo asigna
      email: usuarioForm.email,
      password: usuarioForm.password,
      rol: usuarioForm.rol,
      a2f: usuarioForm.a2f,
      estado: usuarioForm.estado,
    };

    const empleado: Empleado = {
      id: null as any, // el back lo asigna
      nombre: empleadoForm.nombre,
      fechaNacimiento: new Date(empleadoForm.fechaNacimiento),
      genero: empleadoForm.genero,
      estadoCivil: empleadoForm.estadoCivil,
      telefono: empleadoForm.telefono,
      colegiado: empleadoForm.colegiado,
      sueldo: Number(empleadoForm.salario),
      bono:0,
      aplicaIgss:false,
      usuario,
    };

    this.loading = true;

    this.service.createEmpleado(usuario, empleado).subscribe({
      next: () => {
        this.loading = false;
        this.pendingEmail = usuario.email;
        this.step = 'CONFIRM';
        this.successMessage =
          'Hemos enviado un código de verificación a tu correo. Ingrésalo para confirmar la cuenta.';
        // NO reseteamos el form aún, hasta que se confirme el correo
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        Swal.fire({title:'error',text:err.error,icon:'error'})
      },
    });
  }

  onSubmitCodigo(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.codigoForm.invalid) {
      this.codigoForm.markAllAsTouched();
      return;
    }

    const { codigo } = this.codigoForm.value;
    this.loading = true;

    this.service.confirmarCorreo(codigo).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Correo electrónico confirmado correctamente.';
        this.step = 'FORM';
        this.codigoForm.reset();
        this.form.reset({
          usuario: { rol: 'EMPLEADO', a2f: false, estado: true },
          empleado: { genero: true, estadoCivil: false, salario: 0 },
        });
        this.submitted = false;
        this.pendingEmail = null;
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        Swal.fire({title:'error',text:err.error,icon:'error'})
      },
    });
  }

  volverAlFormulario(): void {
    this.step = 'FORM';
    this.codigoForm.reset();
    this.successMessage = null;
    // no reseteo el form principal por si quiere corregir algo
  }
}