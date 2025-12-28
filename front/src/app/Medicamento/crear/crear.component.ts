import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MedicamentoService } from '../../services/Medicamento/medicamento.service';
import { Medicamento } from '../../interfaces/Medicamento'; // ajusta tu ruta

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent implements OnInit {
  medicamentos: Medicamento[] = [];

  form: Medicamento = {
    id: undefined,
    nombre: '',
    precio: 0,
    minimo: 0,
    stock: 0,
    tipo: true,
    imagen: ''
  };

  loading = false;

  imagenPreview = '';
  imagenNombre = '';
  stockModalOpen = false;
  selected: Medicamento | null = null;
  stockCantidad = 0; 

  constructor(private servicio: MedicamentoService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.servicio.findAll().subscribe({
      next: (resp) => (this.medicamentos = resp || []),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cargar', icon: 'error' })
    });
  }

  guardar(): void {
    if (!this.form.nombre.trim()) {
      Swal.fire({ title: 'Validación', text: 'El nombre es requerido.', icon: 'warning' });
      return;
    }
    if (this.form.precio < 0 || this.form.minimo < 0 || this.form.stock < 0) {
      Swal.fire({ title: 'Validación', text: 'Precio, mínimo y stock no pueden ser negativos.', icon: 'warning' });
      return;
    }

    this.loading = true;
    this.servicio.saveMedicamento(this.form).subscribe({
      next: () => {
        Swal.fire({ title: 'Listo', text: 'Medicamento guardado.', icon: 'success' });
        this.resetForm();
        this.cargar();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo guardar', icon: 'error' }),
      complete: () => (this.loading = false)
    });
  }

  resetForm(): void {
    this.form = {
      id: undefined,
      nombre: '',
      precio: 0,
      minimo: 0,
      stock: 0,
      tipo: true,
      imagen: ''
    };
  }

  abrirStock(m: Medicamento): void {
    this.selected = m;
    this.stockCantidad = 0;
    this.stockModalOpen = true;
  }

  cerrarStock(): void {
    this.stockModalOpen = false;
    this.selected = null;
    this.stockCantidad = 0;
  }

  aplicarStock(): void {
    if (!this.selected?.id) return;

    const cant = Number(this.stockCantidad);
    if (!Number.isFinite(cant) || cant === 0) {
      Swal.fire({ title: 'Validación', text: 'Ingresa una cantidad distinta de 0.', icon: 'warning' });
      return;
    }

    this.servicio.updateStock(this.selected.id, cant).subscribe({
      next: () => {
        Swal.fire({ title: 'Listo', text: 'Stock actualizado.', icon: 'success' });
        this.cerrarStock();
        this.cargar();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo actualizar stock', icon: 'error' })
    });
  }

  esBajoStock(m: Medicamento): boolean {
    return (m.stock ?? 0) <= (m.minimo ?? 0);
  }

  onFileSelected(ev: Event): void {
    const input = ev.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    const maxMB = 2;
    if (file.size > maxMB * 1024 * 1024) {
      Swal.fire({ title: 'Validación', text: `La imagen debe ser <= ${maxMB}MB.`, icon: 'warning' });
      if (input) input.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      Swal.fire({ title: 'Validación', text: 'Solo se permiten imágenes.', icon: 'warning' });
      if (input) input.value = '';
      return;
    }

    this.imagenNombre = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');

      this.imagenPreview = dataUrl;

      this.form.imagen = dataUrl;
    };
    reader.onerror = () => Swal.fire({ title: 'Error', text: 'No se pudo leer la imagen.', icon: 'error' });

    reader.readAsDataURL(file);
  }

  quitarImagen(): void {
    this.imagenPreview = '';
    this.imagenNombre = '';
    this.form.imagen = '';
  }

  private extraerBase64(dataUrl: string): string {
    const idx = dataUrl.indexOf('base64,');
    return idx >= 0 ? dataUrl.substring(idx + 'base64,'.length) : dataUrl;
  }

}
