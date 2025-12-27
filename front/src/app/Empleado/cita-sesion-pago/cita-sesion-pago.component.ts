import { Component } from '@angular/core';
import { Cita, Estado } from '../../interfaces/Cita';
import { Sesion } from '../../interfaces/Sesion';
import { CitaService } from '../../services/Cita/cita.service';
import { HistoriaService } from '../../services/Historia/historia.service';
import { CompraService } from '../../services/Pago/compra.service';
import Swal from 'sweetalert2';
import { PagoSesion } from '../../interfaces/Pago';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


type Tab = 'CITAS' | 'SESIONES';
type PagoTipo = 'CITA' | 'SESION';

@Component({ 
  selector: 'app-cita-sesion-pago', 
  imports: [CommonModule,FormsModule], 
  templateUrl: './cita-sesion-pago.component.html', 
  styleUrl: './cita-sesion-pago.component.css' 
})
export class CitaSesionPagoComponent {
  tab: Tab = 'CITAS';

  citas: Cita[] = [];
  sesiones: Sesion[] = [];

  cargandoCitas = false;
  cargandoSesiones = false;

  // búsqueda
  qIdCita: string = '';
  qIdSesion: string = '';

  // modal pago
  showPago = false;
  pagoTipo: PagoTipo = 'CITA';
  citaSel: Cita | null = null;
  sesionSel: Sesion | null = null;

  // tipo pago
  // true = tarjeta, false = efectivo/factura
  pagoTarjeta = true;

  tarjeta = '';
  codigo = '';
  fechaVencimiento = '';
  total = 0;

  pagando = false;

  constructor(
    private citaService: CitaService,
    private historiaService: HistoriaService,
    private compraService: CompraService
  ) { }

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargarCitas();
    this.cargarSesiones();
  }

  cargarCitas(): void {
    this.cargandoCitas = true;
    this.citaService.getAllCitas().subscribe({
      next: (resp) => (this.citas = resp ?? []),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar citas', icon: 'error' }),
      complete: () => (this.cargandoCitas = false)
    });
  }

  cargarSesiones(): void {
    this.cargandoSesiones = true;
    this.historiaService.getAllSesiones().subscribe({
      next: (resp) => (this.sesiones = resp ?? []),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar sesiones', icon: 'error' }),
      complete: () => (this.cargandoSesiones = false)
    });
  }

  // ===== helpers =====
  formatFecha(iso: string): string {
    if (!iso) return '';
    const [d, t] = String(iso).split('T');
    if (!t) return d;
    return `${d} ${t.substring(0, 5)}`;
  }

  // ===== pagadas =====
  citaPagada(c: Cita): boolean {
    return c?.estado === Estado.PAGADA;
  }

  sesionPagada(s: Sesion): boolean {
    return !!s?.estadoPago;
  }

  // ===== buscar =====
  buscarCita(): void {
    const raw = (this.qIdCita ?? '').toString().trim();
    const id = Number(raw);
    if (!raw || Number.isNaN(id) || id <= 0) {
      Swal.fire({ title: 'Validación', text: 'Ingresa un ID de cita válido.', icon: 'warning' });
      return;
    }

    this.citaService.getCitaById(id).subscribe({
      next: (resp) => {
        this.tab = 'CITAS';
        this.citas = resp ? [resp] : [];
        if (!resp) Swal.fire({ title: 'Info', text: 'No se encontró la cita.', icon: 'info' });
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se encontró la cita', icon: 'error' })
    });
  }

  buscarSesion(): void {
    const raw = (this.qIdSesion ?? '').toString().trim();
    const id = Number(raw);
    if (!raw || Number.isNaN(id) || id <= 0) {
      Swal.fire({ title: 'Validación', text: 'Ingresa un ID de sesión válido.', icon: 'warning' });
      return;
    }

    this.historiaService.getSesionById(id).subscribe({
      next: (resp) => {
        this.tab = 'SESIONES';
        this.sesiones = resp ? [resp] : [];
        if (!resp) Swal.fire({ title: 'Info', text: 'No se encontró la sesión.', icon: 'info' });
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se encontró la sesión', icon: 'error' })
    });
  }

  resetListado(): void {
    this.qIdCita = '';
    this.qIdSesion = '';
    this.cargarTodo();
  }

  // ===== abrir pago =====
  abrirPagoCita(c: Cita): void {
    if (!c?.id) return;

    this.pagoTipo = 'CITA';
    this.citaSel = c;
    this.sesionSel = null;

    this.pagoTarjeta = true; // default
    this.tarjeta = '';
    this.codigo = '';
    this.fechaVencimiento = '';
    this.total = 0;

    this.showPago = true;
  }

  abrirPagoSesion(s: Sesion): void {
    if (!s?.id) return;

    this.pagoTipo = 'SESION';
    this.sesionSel = s;
    this.citaSel = null;

    this.pagoTarjeta = true; // default
    this.tarjeta = '';
    this.codigo = '';
    this.fechaVencimiento = '';
    // si tienes costo en historia:
    // this.total = Number(s.historia?.costoSesion ?? 0);
    this.total = 0;

    this.showPago = true;
  }

  cerrarPago(): void {
    this.showPago = false;
    this.pagando = false;

    this.citaSel = null;
    this.sesionSel = null;

    this.tarjeta = '';
    this.codigo = '';
    this.fechaVencimiento = '';
    this.total = 0;
    this.pagoTarjeta = true;
  }

  pagar(): void {
    if (this.pagoTipo === 'CITA' && !this.citaSel) return;
    if (this.pagoTipo === 'SESION' && !this.sesionSel) return;

    const total = Number(this.total ?? 0);
    if (Number.isNaN(total) || total < 0) {
      Swal.fire({ title: 'Validación', text: 'Total inválido.', icon: 'warning' });
      return;
    }

    // Si es tarjeta, validar campos
    const tarjeta = (this.tarjeta || '').trim();
    const codigo = (this.codigo || '').trim();
    const venc = (this.fechaVencimiento || '').trim();

    if (this.pagoTarjeta) {
      if (!tarjeta || tarjeta.length < 8) {
        Swal.fire({ title: 'Validación', text: 'Ingresa una tarjeta válida.', icon: 'warning' });
        return;
      }
      if (!codigo || codigo.length < 3) {
        Swal.fire({ title: 'Validación', text: 'Ingresa un código válido.', icon: 'warning' });
        return;
      }
      if (!venc) {
        Swal.fire({ title: 'Validación', text: 'Ingresa la fecha de vencimiento.', icon: 'warning' });
        return;
      }
    }

    const payload: PagoSesion = {
      id: undefined,
      sesion: this.pagoTipo === 'SESION' ? this.sesionSel! : undefined,
      cita: this.pagoTipo === 'CITA' ? this.citaSel! : undefined,
      // ✅ tipo = true tarjeta, false efectivo/factura
      tarjeta: this.pagoTarjeta ? tarjeta : '',
      codigo: this.pagoTarjeta ? codigo : '',
      fechaVencimiento: this.pagoTarjeta ? venc : '',
      total
    };

    // Si tu backend necesita campo "tipo" en PagoSesion, tendrías que agregarlo a la interfaz.
    // Como tu interfaz NO lo trae, asumo que el backend decide por campos vacíos o por "cita/sesion".
    // Si en realidad tu backend usa "tipo", decime y lo ajusto.

    this.pagando = true;
    this.compraService.pagarSesion(payload).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Pago registrado.', icon: 'success' });

        // reflejar en UI sin recargar
        if (this.pagoTipo === 'CITA' && this.citaSel?.id) {
          this.citas = this.citas.map((x) =>
            x.id === this.citaSel!.id ? ({ ...x, estado: Estado.PAGADA } as any) : x
          );
        } else if (this.pagoTipo === 'SESION' && this.sesionSel?.id) {
          this.sesiones = this.sesiones.map((x) =>
            x.id === this.sesionSel!.id ? ({ ...x, estadoPago: true } as any) : x
          );
        }

        this.cerrarPago();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo pagar', icon: 'error' }),
      complete: () => (this.pagando = false)
    });
  }

  trackById = (_: number, x: any) => x?.id;
}
