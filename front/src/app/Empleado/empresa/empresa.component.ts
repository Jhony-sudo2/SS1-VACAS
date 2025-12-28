import { Component } from '@angular/core';
import { Empresa } from '../../interfaces/Empresa';
import { GeneralService } from '../../services/General/general.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empresa',
  imports: [CommonModule, FormsModule],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent {
  empresa: Empresa = { id: 0, nombre: '', precioCita: 0, tiempoCita: 0, imagen: '' };

  cargando = false;
  guardando = false;

  // Preview (puede ser URL o dataURL)
  imagenPreview = '';
  imagenNombre = '';

  // Para saber si el usuario cambió la imagen
  imagenNueva = false;

  constructor(private servicio: GeneralService) { }

  ngOnInit(): void {
    this.cargarEmpresa();
  }

  cargarEmpresa(): void {
    this.cargando = true;
    this.servicio.getEmpresa().subscribe({
      next: (resp) => {
        this.empresa = resp ?? ({} as any);

        // ✅ si viene URL, se usa directo
        this.imagenPreview = this.empresa?.imagen || '';
        this.imagenNueva = false;
        this.imagenNombre = '';
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cargar empresa', icon: 'error' }),
      complete: () => (this.cargando = false)
    });
  }

  updateEmpresa(): void {
    const nombre = (this.empresa?.nombre || '').trim();
    if (!nombre) {
      Swal.fire({ title: 'Validación', text: 'Ingresa el nombre.', icon: 'warning' });
      return;
    }
    if (this.empresa.precioCita == null || this.empresa.precioCita < 0) {
      Swal.fire({ title: 'Validación', text: 'Precio cita no puede ser negativo.', icon: 'warning' });
      return;
    }
    if (!this.empresa.tiempoCita || this.empresa.tiempoCita <= 0) {
      Swal.fire({ title: 'Validación', text: 'Tiempo de cita debe ser mayor a 0 (minutos).', icon: 'warning' });
      return;
    }

    this.empresa.nombre = nombre;

    // ✅ Si no seleccionó imagen nueva, NO tocamos empresa.imagen (se queda URL)
    // ✅ Si seleccionó imagen nueva, empresa.imagen ya trae dataURL o base64 (dependiendo cómo lo guardes)
    this.guardando = true;
    this.servicio.updateEmpresa(this.empresa).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Empresa actualizada', icon: 'success' });
        // si el backend transforma y devuelve URL luego, ideal recargar:
        this.cargarEmpresa();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo actualizar', icon: 'error' }),
      complete: () => (this.guardando = false)
    });
  }

  // ======= IMAGEN =======
  onFileSelected(ev: Event): void {
    const input = ev.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    const maxMB = 2;
    if (file.size > maxMB * 1024 * 1024) {
      Swal.fire({ title: 'Validación', text: `La imagen debe ser <= ${maxMB}MB.`, icon: 'warning' });
      input!.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      Swal.fire({ title: 'Validación', text: 'Solo se permiten imágenes.', icon: 'warning' });
      input!.value = '';
      return;
    }

    this.imagenNombre = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');

      // Preview inmediato
      this.imagenPreview = dataUrl;

      // ✅ Guardar lo que vas a enviar al backend en empresa.imagen
      // Opción A (recomendada): enviar dataURL completo
      this.empresa.imagen = dataUrl;

      // Opción B: enviar solo base64
      // this.empresa.imagen = this.extraerBase64(dataUrl);

      this.imagenNueva = true;
    };
    reader.onerror = () => Swal.fire({ title: 'Error', text: 'No se pudo leer la imagen.', icon: 'error' });

    reader.readAsDataURL(file);
  }

  quitarImagen(): void {
    // ⚠️ Si quitás, decidí regla: mandar vacío para que backend la elimine.
    // Si tu backend NO permite vacío, entonces solo dejá preview del URL original.
    this.imagenPreview = '';
    this.imagenNombre = '';
    this.imagenNueva = true;
    this.empresa.imagen = ''; // backend debería interpretar como "sin imagen"
  }

  private extraerBase64(dataUrl: string): string {
    const idx = dataUrl.indexOf('base64,');
    return idx >= 0 ? dataUrl.substring(idx + 'base64,'.length) : dataUrl;
  }
}
