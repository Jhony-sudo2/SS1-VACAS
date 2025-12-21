import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/Admin/admin.service';
import { Area, AsignacionServicio, Servicio } from '../../interfaces/Area';
import { GeneralService } from '../../services/General/general.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-area-crear',
  imports: [CommonModule, FormsModule],
  templateUrl: './area-crear.component.html',
  styleUrl: './area-crear.component.css'
})
export class AreaCrearComponent implements OnInit {
  servicios: Servicio[] = [];
  areas: Area[] = [];

  // formularios
  areaNombre = '';
  servicioNombre = '';

  // asignación
  selectedAreaId: number | null = null;
  serviciosSeleccionados: number[] = [];

  constructor(private servicio: AdminService, private servicioGeneral: GeneralService) { }

  ngOnInit(): void {
    this.cargarListas();
  }

  cargarListas(): void {
    this.servicioGeneral.getAllAreas().subscribe({
      next: (response) => (this.areas = response || []),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar áreas', icon: 'error' })
    });

    this.servicioGeneral.getAllServicios().subscribe({
      next: (response) => (this.servicios = response || []),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar servicios', icon: 'error' })
    });
  }

  crearArea(): void {
    const nombre = this.areaNombre.trim();
    if (!nombre) {
      Swal.fire({ title: 'Validación', text: 'Ingresa el nombre del área.', icon: 'warning' });
      return;
    }

    const data: Area = { id: undefined, nombre };
    this.servicio.saveArea(data).subscribe({
      next: () => {
        Swal.fire({ title: 'Listo', text: 'Área creada.', icon: 'success' });
        this.areaNombre = '';
        this.cargarListas();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo crear el área', icon: 'error' })
    });
  }

  crearServicio(): void {
    const nombre = this.servicioNombre.trim();
    if (!nombre) {
      Swal.fire({ title: 'Validación', text: 'Ingresa el nombre del servicio.', icon: 'warning' });
      return;
    }

    const data: Servicio = { id: undefined, nombre };
    this.servicio.saveServicio(data).subscribe({
      next: () => {
        Swal.fire({ title: 'Listo', text: 'Servicio creado.', icon: 'success' });
        this.servicioNombre = '';
        this.cargarListas();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo crear el servicio', icon: 'error' })
    });
  }

  // Cuando cambias de área en el select
  onChangeArea(): void {
    this.serviciosSeleccionados = [];

    if (!this.selectedAreaId) return;

    this.servicioGeneral.getAllServiciosArea(this.selectedAreaId).subscribe({
      next: (asignados) => {
        // asignados: Servicio[]
        const ids = (asignados || [])
          .map(s => s?.id)
          .filter((id): id is number => typeof id === 'number');

        // Marcar los servicios asignados
        this.serviciosSeleccionados = ids;
      },
      error: (err) => {
        this.serviciosSeleccionados = [];
        Swal.fire({
          title: 'Error',
          text: err?.error || 'No se pudieron cargar los servicios asignados del área',
          icon: 'error'
        });
      }
    });
  }
  toggleServicioEvent(servicioId: number | undefined, ev: Event): void {
    if (servicioId === undefined) return;

    const input = ev.target as HTMLInputElement | null;
    const checked = !!input?.checked;

    this.toggleServicio(servicioId, checked);
  }
  toggleServicio(servicioId: number | undefined, checked: boolean): void {
    if (servicioId === undefined) return;

    if (checked) {
      if (!this.serviciosSeleccionados.includes(servicioId)) {
        this.serviciosSeleccionados = [...this.serviciosSeleccionados, servicioId];
      }
    } else {
      this.serviciosSeleccionados = this.serviciosSeleccionados.filter((x) => x !== servicioId);
    }
  }

  guardarAsignacion(): void {
    if (!this.selectedAreaId) {
      Swal.fire({ title: 'Validación', text: 'Selecciona un área.', icon: 'warning' });
      return;
    }
    if (this.serviciosSeleccionados.length === 0) {
      Swal.fire({ title: 'Validación', text: 'Selecciona al menos un servicio.', icon: 'warning' });
      return;
    }

    const payload: AsignacionServicio = {
      areaId: this.selectedAreaId,
      servicios: this.serviciosSeleccionados
    };

    this.servicio.asignarServicio(payload).subscribe({
      next: () => Swal.fire({ title: 'Listo', text: 'Servicios asignados al área.', icon: 'success' }),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo asignar', icon: 'error' })
    });
  }



  // Para el HTML (checked)
  isServicioSeleccionado(servicioId: number | undefined): boolean {
    if (servicioId === undefined) return false;
    return this.serviciosSeleccionados.includes(servicioId);
  }
}
