import { Component } from '@angular/core';
import { EmpleadoService } from '../../services/Empleado/empleado.service';
import { Area } from '../../interfaces/Area';
import { Empleado } from '../../interfaces/Usuario';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { GeneralService } from '../../services/General/general.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asignar-area',
  imports: [FormsModule, CommonModule],
  templateUrl: './asignar-area.component.html',
  styleUrl: './asignar-area.component.css'
})
export class AsignarAreaComponent {
  areas: Area[] = [];
  empleado: Empleado = { id: 0 } as Empleado;
  asignadas: number[] = []; // Para almacenar las áreas seleccionadas

  constructor(
    private servicio: EmpleadoService,
    private route: ActivatedRoute,
    private general: GeneralService
  ) { }

  ngOnInit(): void {
    // Obtener el id del empleado desde la URL
    const id = Number(this.route.snapshot.paramMap.get('empleadoId'));

    // Cargar datos del empleado
    this.servicio.getEmpleadoById(id).subscribe({
      next: (response) => {
        this.empleado = response;
        // Cargar áreas asignadas al empleado (si ya existen)
        this.cargarAreasAsignadas(id);
      },
      error: (err) => {
        Swal.fire({ title: 'Error', text: err.error, icon: 'error' });
      }
    });

    // Cargar todas las áreas disponibles
    this.general.getAllAreas().subscribe({
      next: (response) => {
        this.areas = response;
      },
      error: (err) => {
        Swal.fire({ title: 'Error', text: err.error, icon: 'error' });
      }
    });
  }

  cargarAreasAsignadas(id: number): void {
    // Aquí deberías llamar a un servicio para cargar las áreas asignadas al empleado
    this.servicio.getAreas(id).subscribe({
      next: (areasEmpleado) => {
        this.asignadas = areasEmpleado.map(a => a.id).filter((id): id is number => id !== undefined);
      },
      error: (err) => {
        Swal.fire({ title: 'Error', text: err.error, icon: 'error' });
      }
    });
  }

  // Función para guardar las áreas asignadas
  guardarAsignacion(): void {
    if (this.empleado.id)
      this.servicio.asignarArea(this.empleado.id, this.asignadas).subscribe({
        next: () => {
          Swal.fire('Áreas asignadas', 'Las áreas se han asignado correctamente.', 'success');
        },
        error: (err) => {
          Swal.fire({ title: 'Error', text: err.error, icon: 'error' });
        }
      });
  }
  onCheckboxChange(event: Event, areaId: number | undefined): void {
    if (areaId === undefined) return;

    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      // agrega sin duplicar
      if (!this.asignadas.includes(areaId)) {
        this.asignadas = [...this.asignadas, areaId];
      }
    } else {
      // elimina
      this.asignadas = this.asignadas.filter(id => id !== areaId);
    }
  }


}
