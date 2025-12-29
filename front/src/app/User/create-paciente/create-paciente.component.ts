import { Component } from '@angular/core';
import { UserService } from '../../services/User/user.service';
import { Paciente, Usuario } from '../../interfaces/Usuario';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-paciente',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-paciente.component.html',
  styleUrl: './create-paciente.component.css'
})
export class CreatePacienteComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      usuario: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        rol: ['PACIENTE', Validators.required],  // puedes cambiar opciones
        a2f: [false],
        estado: [false]
      }),
      paciente: this.fb.group({
        nombre: ['', Validators.required],
        fechaNacimiento: ['', Validators.required],
        genero: [true, Validators.required],        // true = Masculino, false = Femenino
        estadoCivil: [false, Validators.required],  // false = Soltero, true = Casado (ejemplo)
        direccion: ['', Validators.required],
        nivelEducativo: ['', Validators.required],
        telefono: ['', Validators.required],
        personEmergencia: ['', Validators.required],
        telefonoEmergencia: ['', Validators.required],
        procedencia: ['', Validators.required]
      })
    });
  }

  get usuarioGroup(): FormGroup {
    return this.form.get('usuario') as FormGroup;
  }

  get pacienteGroup(): FormGroup {
    return this.form.get('paciente') as FormGroup;
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
    const pacienteForm = this.pacienteGroup.value;

    const usuario: Usuario = {
      id: null as any, // el back lo asigna
      email: usuarioForm.email,
      password: usuarioForm.password,
      rol: usuarioForm.rol,
      a2f: usuarioForm.a2f,
      estado: usuarioForm.estado
    };

    const paciente: Paciente = {
      id: null as any, // el back lo asigna
      nombre: pacienteForm.nombre,
      fechaNacimiento: new Date(pacienteForm.fechaNacimiento),
      genero: pacienteForm.genero,
      estadoCivil: pacienteForm.estadoCivil,
      direccion: pacienteForm.direccion,
      nivelEducativo: pacienteForm.nivelEducativo,
      telefono: pacienteForm.telefono,
      personEmergencia: pacienteForm.personEmergencia,
      telefonoEmergencia: pacienteForm.telefonoEmergencia,
      procedencia: pacienteForm.procedencia,
      usuario: usuario
    };

    this.loading = true;

    this.userService.createPaciente(usuario, paciente).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Paciente creado correctamente.';
        this.form.reset({
          usuario: { rol: 'PACIENTE', a2f: false, estado: true },
          paciente: { genero: true, estadoCivil: false }
        });
        this.submitted = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Ocurrió un error al crear el paciente.';
        console.error(err);
      }
    });
  }
}
