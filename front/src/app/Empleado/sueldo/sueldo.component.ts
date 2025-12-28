import { Component } from '@angular/core';
import { Empleado } from '../../interfaces/Usuario';
import { EmpleadoService } from '../../services/Empleado/empleado.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sueldo',
  imports: [CommonModule,FormsModule],
  templateUrl: './sueldo.component.html',
  styleUrl: './sueldo.component.css'
})
export class SueldoComponent {
  empleado: Empleado = { id: 0 } as Empleado;

  salario = 0;
  bono = 0;
  aplicaIgss = false;

  igssPorcentaje = 4.83;

  loading = false;

  constructor(
    private servicio: EmpleadoService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('empleadoId'));
    if (!id) return;

    this.servicio.getEmpleadoById(id).subscribe({
      next: (response: any) => {
        this.empleado = response;

        this.salario = Number(response?.sueldo ?? 0) || 0;
        this.bono = Number(response?.bono ?? 0) || 0;
        this.aplicaIgss = !!response?.aplicaIgss;
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cargar empleado', icon: 'error' })
    });
  }

  get igssEstimado(): number {
    if (!this.aplicaIgss) return 0;
    const base = Number(this.salario) || 0;
    return +(base * (this.igssPorcentaje / 100)).toFixed(2);
  }

  get netoEstimado(): number {
    const base = Number(this.salario) || 0;
    const b = Number(this.bono) || 0;
    return +(base + b - this.igssEstimado).toFixed(2);
  }

  guardar(): void {
    if (!this.empleado?.id) return;

    const s = Number(this.salario);
    const b = Number(this.bono);

    if (!Number.isFinite(s) || s < 0) {
      Swal.fire({ title: 'Validación', text: 'El sueldo debe ser un número >= 0.', icon: 'warning' });
      return;
    }
    if (!Number.isFinite(b) || b < 0) {
      Swal.fire({ title: 'Validación', text: 'El bono debe ser un número >= 0.', icon: 'warning' });
      return;
    }

    this.loading = true;
    this.servicio.updateSalario(this.empleado.id, s, String(b), this.aplicaIgss).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Datos de salario actualizados', icon: 'success' });

        // actualizar objeto local para que quede consistente
        this.empleado.sueldo = s;
        this.empleado.bono = b;
        this.empleado.aplicaIgss = this.aplicaIgss;
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo actualizar', icon: 'error' }),
      complete: () => (this.loading = false)
    });
  }

  resetValores(): void {
    this.salario = Number(this.empleado?.sueldo ?? 0) || 0;
    this.bono = Number(this.empleado?.bono ?? 0) || 0;
    this.aplicaIgss = !!this.empleado?.aplicaIgss;
  }
}