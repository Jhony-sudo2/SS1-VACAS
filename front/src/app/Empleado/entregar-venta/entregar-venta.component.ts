import { Component } from '@angular/core';
import { CompraService } from '../../services/Pago/compra.service';
import { Detalle, ResponseReceta, Venta } from '../../interfaces/Pago';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entregar-venta',
  imports: [CommonModule,FormsModule],
  templateUrl: './entregar-venta.component.html',
  styleUrl: './entregar-venta.component.css'
})
export class EntregarVentaComponent {
  ventas: Venta[] = [];

  cargando = false;
  entregandoId: number | null = null;

  // búsqueda
  qId: string = '';
  buscando = false;

  // modal detalle
  showDetalle = false;
  ventaDetalle: Venta | null = null;
  detalles: ResponseReceta[] = [];
  cargandoDetalle = false;

  constructor(private servicio: CompraService) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.cargando = true;
    this.servicio.getAllVentas().subscribe({
      next: (response) => (this.ventas = response ?? []),
      error: (err) => {
        this.ventas = [];
        Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar ventas', icon: 'error' });
      },
      complete: () => (this.cargando = false)
    });
  }

  buscarPorId(): void {
  const id = Number(this.qId);

  if (!Number.isFinite(id) || id <= 0) {
    Swal.fire({ title: 'Validación', text: 'Ingresa un ID de venta válido.', icon: 'warning' });
    return;
  }

  this.buscando = true;
  this.servicio.findById(id).subscribe({
    next: (v) => {
      if (!v) {
        this.ventas = [];
        Swal.fire({ title: 'Info', text: 'No se encontró la venta.', icon: 'info' });
        return;
      }
      this.ventas = [v];
    },
    error: (err) => {
      this.ventas = [];
      Swal.fire({ title: 'Error', text: err?.error || 'No se encontró la venta', icon: 'error' });
    },
    complete: () => (this.buscando = false)
  });
}

  verTodas(): void {
    this.qId = '';
    this.cargarVentas();
  }

  maskCard(card: string): string {
    const s = (card || '').replace(/\s+/g, '');
    if (s.length <= 4) return s;
    return '**** **** **** ' + s.slice(-4);
  }

  formatFecha(iso: string): string {
    if (!iso) return '';
    const [d, t] = iso.split('T');
    if (!t) return d;
    return `${d} ${t.substring(0, 5)}`;
  }

  badgeClass(entregada: boolean): string {
    const base = 'px-3 py-1 rounded-full text-xs font-bold border';
    return entregada
      ? `${base} bg-emerald-500/15 text-emerald-300 border-emerald-500/30`
      : `${base} bg-amber-500/15 text-amber-300 border-amber-500/30`;
  }

  // ===== Detalle =====
  abrirDetalle(v: Venta): void {
    if (!v?.id) return;

    this.showDetalle = true;
    this.ventaDetalle = v;
    this.detalles = [];
    this.cargandoDetalle = true;

    this.servicio.getDetallesVenta(v.id).subscribe({
      next: (resp) => (this.detalles = resp ?? []),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cargar detalle', icon: 'error' }),
      complete: () => (this.cargandoDetalle = false)
    });
  }

  cerrarDetalle(): void {
    this.showDetalle = false;
    this.ventaDetalle = null;
    this.detalles = [];
    this.cargandoDetalle = false;
  }

  // ===== Entregar =====
  entregar(v: Venta): void {
    if (!v?.id) return;
    if (v.estadoEntrega) return;

    Swal.fire({
      title: 'Confirmar',
      text: `¿Marcar como ENTREGADA la venta #${v.id}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, entregar',
      cancelButtonText: 'No'
    }).then((r) => {
      if (!r.isConfirmed) return;

      this.entregandoId = v.id;

      this.servicio.entregarVenta(v.id).subscribe({
        next: () => {
          Swal.fire({ title: 'OK', text: 'Venta marcada como entregada.', icon: 'success' });

          // actualizar local
          this.ventas = this.ventas.map((x) => (x.id === v.id ? { ...x, estadoEntrega: true } : x));

          // reflejar en modal si aplica
          if (this.ventaDetalle?.id === v.id) {
            this.ventaDetalle = { ...this.ventaDetalle, estadoEntrega: true };
          }
        },
        error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo entregar', icon: 'error' }),
        complete: () => (this.entregandoId = null)
      });
    });
  }

  trackByVentaId = (_: number, v: Venta) => v.id;
}
