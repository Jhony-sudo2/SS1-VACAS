import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { CompraService } from '../../services/Pago/compra.service';
import { PagoSesion, ResponseReceta, Venta } from '../../interfaces/Pago';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compras',
  imports: [CommonModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent {
  ventas: Venta[] = [];
  pagoSesion: PagoSesion[] = [];

  cargandoVentas = false;
  cargandoPagos = false;

  showDetalle = false;
  ventaDetalle: Venta | null = null;
  detalles: ResponseReceta[] = [];
  cargandoDetalle = false;

  tab: 'VENTAS' | 'PAGOS' = 'VENTAS';

  constructor(private authService: AuthService, private servicio: CompraService) { }

  ngOnInit(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario?.id) return;

    this.cargarVentas(usuario.id);
    this.cargarPagos(usuario.id);
  }

  private cargarVentas(idPaciente: number): void {
    this.cargandoVentas = true;
    this.servicio.findVentasByPacienteId(idPaciente).subscribe({
      next: (response) => (this.ventas = response ?? []),
      error: (err) => {
        this.ventas = [];
        Swal.fire({ title: 'ERROR', text: err?.error || 'No se pudieron cargar compras', icon: 'error' });
      },
      complete: () => (this.cargandoVentas = false)
    });
  }

  private cargarPagos(idPaciente: number): void {
    this.cargandoPagos = true;
    this.servicio.findPagoSesionByPacienteId(idPaciente).subscribe({
      next: (response) => (this.pagoSesion = response ?? []),
      error: (err) => {
        this.pagoSesion = [];
        Swal.fire({ title: 'ERROR', text: err?.error || 'No se pudieron cargar pagos', icon: 'error' });
      },
      complete: () => (this.cargandoPagos = false)
    });
  }

  // helpers
  formatFecha(iso: string): string {
    if (!iso) return '';
    const [d, t] = iso.split('T');
    if (!t) return d;
    return `${d} ${t.substring(0, 5)}`;
  }

  maskCard(card: string): string {
    const s = (card || '').replace(/\s+/g, '');
    if (s.length <= 4) return s;
    return '**** **** **** ' + s.slice(-4);
  }

  pagoTitulo(p: PagoSesion): string {
    if (p?.sesion) return 'Pago de sesión';
    if (p?.cita) return 'Pago de cita';
    return 'Pago';
  }

  refPago(p: PagoSesion): string {
    const sesId = (p?.sesion as any)?.id;
    const citId = (p?.cita as any)?.id;
    if (sesId) return `Sesión #${sesId}`;
    if (citId) return `Cita #${citId}`;
    return '—';
  }
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
   badgeClass(entregada: boolean): string {
    const base = 'px-3 py-1 rounded-full text-xs font-bold border';
    return entregada
      ? `${base} bg-emerald-500/15 text-emerald-300 border-emerald-500/30`
      : `${base} bg-amber-500/15 text-amber-300 border-amber-500/30`;
  }

  cerrarDetalle(): void {
    this.showDetalle = false;
    this.ventaDetalle = null;
    this.detalles = [];
    this.cargandoDetalle = false;
  }
  trackById = (_: number, x: any) => x?.id;
}

