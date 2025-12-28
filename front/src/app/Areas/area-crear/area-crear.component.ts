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

  // formularios área
  areaNombre = '';
  areaDescripcion = '';
  areaImagenPreview = '';
  areaImagenNombre = '';
  areaImagenBase64 = ''; // dataURL

  // formularios servicio
  servicioNombre = '';
  servicioDescripcion = '';
  servicioImagenPreview = '';
  servicioImagenNombre = '';
  servicioImagenBase64 = ''; // dataURL

  // asignación
  selectedAreaId: number | null = null;
  serviciosSeleccionados: number[] = [];

  constructor(private servicio: AdminService, private servicioGeneral: GeneralService) {}

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

  // ========= CREAR AREA =========
  crearArea(): void {
    const nombre = this.areaNombre.trim();
    const descripcion = this.areaDescripcion.trim();

    if (!nombre) {
      Swal.fire({ title: 'Validación', text: 'Ingresa el nombre del área.', icon: 'warning' });
      return;
    }
    if (!descripcion) {
      Swal.fire({ title: 'Validación', text: 'Ingresa la descripción del área.', icon: 'warning' });
      return;
    }

    const data: Area = {
      id: undefined,
      nombre,
      descripcion,
      imagen: this.areaImagenBase64 || '' // ✅ base64 (dataURL)
    };

    this.servicio.saveArea(data).subscribe({
      next: () => {
        Swal.fire({ title: 'Listo', text: 'Área creada.', icon: 'success' });
        this.limpiarAreaForm();
        this.cargarListas();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo crear el área', icon: 'error' })
    });
  }

  limpiarAreaForm(): void {
    this.areaNombre = '';
    this.areaDescripcion = '';
    this.areaImagenPreview = '';
    this.areaImagenNombre = '';
    this.areaImagenBase64 = '';
  }

  onAreaFileSelected(ev: Event): void {
    const file = this.getFileFromEvent(ev);
    if (!file) return;

    this.areaImagenNombre = file.name;

    this.toDataUrl(file)
      .then((dataUrl) => {
        this.areaImagenPreview = dataUrl;
        this.areaImagenBase64 = dataUrl; // ✅ mandar dataURL (base64)
      })
      .catch(() => Swal.fire({ title: 'Error', text: 'No se pudo leer la imagen.', icon: 'error' }));
  }

  quitarAreaImagen(): void {
    this.areaImagenPreview = '';
    this.areaImagenNombre = '';
    this.areaImagenBase64 = '';
  }

  // ========= CREAR SERVICIO =========
  crearServicio(): void {
    const nombre = this.servicioNombre.trim();
    const descripcion = this.servicioDescripcion.trim();

    if (!nombre) {
      Swal.fire({ title: 'Validación', text: 'Ingresa el nombre del servicio.', icon: 'warning' });
      return;
    }
    if (!descripcion) {
      Swal.fire({ title: 'Validación', text: 'Ingresa la descripción del servicio.', icon: 'warning' });
      return;
    }

    const data: Servicio = {
      id: undefined,
      nombre,
      descripcion,
      imagen: this.servicioImagenBase64 || '' // ✅ base64 (dataURL)
    };

    this.servicio.saveServicio(data).subscribe({
      next: () => {
        Swal.fire({ title: 'Listo', text: 'Servicio creado.', icon: 'success' });
        this.limpiarServicioForm();
        this.cargarListas();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo crear el servicio', icon: 'error' })
    });
  }

  limpiarServicioForm(): void {
    this.servicioNombre = '';
    this.servicioDescripcion = '';
    this.servicioImagenPreview = '';
    this.servicioImagenNombre = '';
    this.servicioImagenBase64 = '';
  }

  onServicioFileSelected(ev: Event): void {
    const file = this.getFileFromEvent(ev);
    if (!file) return;

    this.servicioImagenNombre = file.name;

    this.toDataUrl(file)
      .then((dataUrl) => {
        this.servicioImagenPreview = dataUrl;
        this.servicioImagenBase64 = dataUrl; // ✅ mandar dataURL (base64)
      })
      .catch(() => Swal.fire({ title: 'Error', text: 'No se pudo leer la imagen.', icon: 'error' }));
  }

  quitarServicioImagen(): void {
    this.servicioImagenPreview = '';
    this.servicioImagenNombre = '';
    this.servicioImagenBase64 = '';
  }

  // ========= ASIGNACIÓN =========
  onChangeArea(): void {
    this.serviciosSeleccionados = [];
    if (!this.selectedAreaId) return;

    this.servicioGeneral.getAllServiciosArea(this.selectedAreaId).subscribe({
      next: (asignados) => {
        const ids = (asignados || [])
          .map((s) => s?.id)
          .filter((id): id is number => typeof id === 'number');
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

  // ========= HELPERS =========
  isServicioSeleccionado(servicioId: number | undefined): boolean {
    if (servicioId === undefined) return false;
    return this.serviciosSeleccionados.includes(servicioId);
  }

  private getFileFromEvent(ev: Event): File | null {
    const input = ev.target as HTMLInputElement | null;
    const file = input?.files?.[0] || null;
    if (!file) return null;

    const maxMB = 2;
    if (file.size > maxMB * 1024 * 1024) {
      Swal.fire({ title: 'Validación', text: `La imagen debe ser <= ${maxMB}MB.`, icon: 'warning' });
      if (input) input.value = '';
      return null;
    }
    if (!file.type.startsWith('image/')) {
      Swal.fire({ title: 'Validación', text: 'Solo se permiten imágenes.', icon: 'warning' });
      if (input) input.value = '';
      return null;
    }
    return file;
  }

  private toDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject();
      reader.readAsDataURL(file);
    });
  }
}