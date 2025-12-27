import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { HistoriaService } from '../../services/Historia/historia.service';
import { Receta, Tarea } from '../../interfaces/Receta';
import Swal from 'sweetalert2';
import { CompraService } from '../../services/Pago/compra.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Compra, Detalle, ResponseReceta } from '../../interfaces/Pago';

@Component({
  selector: 'app-receta-tareas',
  imports: [CommonModule, FormsModule],
  templateUrl: './receta-tareas.component.html',
  styleUrl: './receta-tareas.component.css'
})
export class RecetaTareasComponent {
  idUsuario = 0;

  recetas: Receta[] = [];
  tareas: Tarea[] = [];

  cargandoRecetas = false;
  cargandoTareas = false;

  // ===== Modal compra =====
  showCompra = false;
  recetaSeleccionada: Receta | null = null;
  itemsReceta: ResponseReceta[] = [];
  cargandoRecetaItems = false;

  // datos pago
  tarjeta = '';
  codigo = '';
  fechaVencimiento = ''; // MM/YY o YYYY-MM (según tu backend)

  comprando = false;

  constructor(
    private authService: AuthService,
    private servicio: HistoriaService,
    private pagoService: CompraService
  ) { }

  ngOnInit(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario?.id) return;

    this.idUsuario = usuario.id;

    this.cargarTareas();
    this.cargarRecetas();
  }

  cargarRecetas(): void {
    this.cargandoRecetas = true;
    this.servicio.getReceta(this.idUsuario).subscribe({
      next: (response) => (this.recetas = response ?? []),
      error: (err) => {
        this.recetas = [];
        Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar recetas', icon: 'error' });
      },
      complete: () => (this.cargandoRecetas = false)
    });
  }

  cargarTareas(): void {
    this.cargandoTareas = true;
    this.servicio.getTareas(this.idUsuario).subscribe({
      next: (response) => (this.tareas = response ?? []),
      error: (err) => {
        this.tareas = [];
        Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar tareas', icon: 'error' });
      },
      complete: () => (this.cargandoTareas = false)
    });
  }

  completarTarea(id: number): void {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Marcar esta tarea como completada?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((r) => {
      if (!r.isConfirmed) return;

      this.servicio.completarTarea(id).subscribe({
        next: () => {
          Swal.fire({ title: 'OK', text: 'TAREA COMPLETADA', icon: 'success' });
          this.tareas = this.tareas.map((t) => (t.id === id ? { ...t, estado: true } : t));
        },
        error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo completar la tarea', icon: 'error' })
      });
    });
  }

  // ======= COMPRA =======

  abrirCompra(r: Receta): void {
    if (!r?.sesion) {
      Swal.fire({ title: 'Error', text: 'La receta no tiene sesión asociada.', icon: 'error' });
      return;
    }
    if (!this.idUsuario) return;

    this.showCompra = true;
    this.recetaSeleccionada = r;

    this.itemsReceta = [];
    this.tarjeta = '';
    this.codigo = '';
    this.fechaVencimiento = '';

    this.cargandoRecetaItems = true;
    this.pagoService.getMedicamentosxRecetaSesionId(r.sesion).subscribe({
      next: (resp) => {
        this.itemsReceta = resp ?? [];
        if (this.itemsReceta.length === 0) {
          Swal.fire({ title: 'Info', text: 'Esta receta no tiene medicamentos para comprar.', icon: 'info' });
        }
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar medicamentos', icon: 'error' }),
      complete: () => (this.cargandoRecetaItems = false)
    });
  }

  cerrarCompra(): void {
    this.showCompra = false;
    this.recetaSeleccionada = null;
    this.itemsReceta = [];
    this.tarjeta = '';
    this.codigo = '';
    this.fechaVencimiento = '';
    this.comprando = false;
  }

  get total(): number {
    return (this.itemsReceta ?? []).reduce((acc, it) => {
      const precio = Number((it?.medicamento as any)?.precio ?? 0);
      const cant = Number(it?.cantidad ?? 0);
      return acc + precio * cant;
    }, 0);
  }

  comprar(): void {
    if (!this.recetaSeleccionada) return;

    if (!this.itemsReceta || this.itemsReceta.length === 0) {
      Swal.fire({ title: 'Validación', text: 'No hay medicamentos para comprar.', icon: 'warning' });
      return;
    }

    const tarjeta = this.tarjeta.trim();
    const codigo = this.codigo.trim();
    const fechaV = this.fechaVencimiento.trim();

    if (!tarjeta || tarjeta.length < 8) {
      Swal.fire({ title: 'Validación', text: 'Ingresa un número de tarjeta válido.', icon: 'warning' });
      return;
    }
    if (!codigo || codigo.length < 3) {
      Swal.fire({ title: 'Validación', text: 'Ingresa un código válido.', icon: 'warning' });
      return;
    }
    if (!fechaV) {
      Swal.fire({ title: 'Validación', text: 'Ingresa la fecha de vencimiento.', icon: 'warning' });
      return;
    }

    const detalle: Detalle[] = this.itemsReceta
      .filter((it) => (it?.medicamento as any)?.id && (it?.cantidad ?? 0) > 0)
      .map((it) => ({
        medicamentoId: Number((it.medicamento as any).id),
        cantidad: Number(it.cantidad)
      }));

    const compra: Compra = {
      detalle,
      pacienteId: this.idUsuario,
      tipo: true,
      tarjeta,
      codigo,
      fechaVencimiento: fechaV
    };

    this.comprando = true;
    this.pagoService.comprar(compra).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Compra realizada.', icon: 'success' });
        this.cerrarCompra();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo realizar la compra', icon: 'error' }),
      complete: () => (this.comprando = false)
    });
  }

  trackById = (_: number, x: any) => x?.id;
}