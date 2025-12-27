import { Component } from '@angular/core';
import { CitaService } from '../../services/Cita/cita.service';
import { HistoriaService } from '../../services/Historia/historia.service';
import { AuthService } from '../../services/Auth/auth.service';
import { CompraService } from '../../services/Pago/compra.service';
import { Cita, Estado } from '../../interfaces/Cita';
import { Sesion, SesionDetail } from '../../interfaces/Sesion';
import Swal from 'sweetalert2';
import { PagoSesion } from '../../interfaces/Pago';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
type Tab = 'CITAS' | 'SESIONES';
type PagoTipo = 'CITA' | 'SESION';

@Component({
  selector: 'app-citas-sesiones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-sesiones.component.html',
  styleUrl: './citas-sesiones.component.css'
})
export class CitasSesionesComponent  {
  tab: Tab = 'CITAS';

  citas: Cita[] = [];
  sesiones: Sesion[] = [];

  cargandoCitas = false;
  cargandoSesiones = false;

  // modal pagar
  showPago = false;
  pagoTipo: PagoTipo = 'CITA';
  citaSel: Cita | null = null;
  sesionSel: Sesion | null = null;

  tarjeta = '';
  codigo = '';
  fechaVencimiento = '';
  total = 0;
  pagando = false;

  // modal detalle sesión
  showDetalle = false;
  detalleSesion: SesionDetail | null = null;
  cargandoDetalle = false;

  EstadoCita = Estado; // para usar en el HTML si lo querés

  constructor(
    private citaService: CitaService,
    private historiaService: HistoriaService,
    private authService: AuthService,
    private compraService: CompraService
  ) { }

  ngOnInit(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario?.id) return;

    // ✅ PACIENTE: sus citas
    this.cargarCitasPaciente(usuario.id);

    // ✅ PACIENTE: sus sesiones
    this.cargarSesionesPaciente(usuario.id);
  }

  cargarCitasPaciente(idPaciente: number): void {
    this.cargandoCitas = true;
    this.citaService.myCitasPaciente(idPaciente).subscribe({
      next: (resp) => (this.citas = resp ?? []),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar citas', icon: 'error' }),
      complete: () => (this.cargandoCitas = false)
    });
  }

  cargarSesionesPaciente(idPaciente: number): void {
    this.cargandoSesiones = true;
    this.historiaService.getSesionByPacienteId(idPaciente).subscribe({
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

  // ===== pago status =====
  citaPagada(c: Cita): boolean {
    return c?.estado === Estado.PAGADA;
  }

  sesionPagada(s: Sesion): boolean {
    return !!s?.estadoPago;
  }

  // ===== abrir pago =====
  abrirPagoCita(c: Cita): void {
    if (!c?.id) return;

    this.pagoTipo = 'CITA';
    this.citaSel = c;
    this.sesionSel = null;

    this.tarjeta = '';
    this.codigo = '';
    this.fechaVencimiento = '';
    this.total = 0; // si tenés total por cita, ponelo aquí

    this.showPago = true;
  }

  abrirPagoSesion(s: Sesion): void {
    if (!s?.id) return;

    this.pagoTipo = 'SESION';
    this.sesionSel = s;
    this.citaSel = null;

    this.tarjeta = '';
    this.codigo = '';
    this.fechaVencimiento = '';
    // si tu modelo tiene costo por sesión:
    // this.total = Number(s.historia?.costoSesion ?? 0);
    this.total = 0;

    this.showPago = true;
  }

  cerrarPago(): void {
    this.showPago = false;
    this.pagoTipo = 'CITA';
    this.citaSel = null;
    this.sesionSel = null;
    this.tarjeta = '';
    this.codigo = '';
    this.fechaVencimiento = '';
    this.total = 0;
    this.pagando = false;
  }

  pagar(): void {
    const tarjeta = (this.tarjeta || '').trim();
    const codigo = (this.codigo || '').trim();
    const venc = (this.fechaVencimiento || '').trim();

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

    const payload: PagoSesion = {
      id: undefined,
      sesion: this.pagoTipo === 'SESION' ? this.sesionSel! : undefined,
      cita: this.pagoTipo === 'CITA' ? this.citaSel! : undefined,
      tarjeta,
      codigo,
      fechaVencimiento: venc,
      total: Number(this.total ?? 0)
    };

    this.pagando = true;
    this.compraService.pagarSesion(payload).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Pago realizado.', icon: 'success' });

        // reflejar en UI
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

  // ===== detalle sesión =====
  verDetalleSesion(s: Sesion): void {
    if (!s?.id) return;

    this.showDetalle = true;
    this.detalleSesion = null;
    this.cargandoDetalle = true;

    this.historiaService.getDetails(Number(s.id)).subscribe({
      next: (resp) => (this.detalleSesion = resp),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cargar detalle', icon: 'error' }),
      complete: () => (this.cargandoDetalle = false)
    });
  }

  cerrarDetalle(): void {
    this.showDetalle = false;
    this.detalleSesion = null;
    this.cargandoDetalle = false;
  }

  trackById = (_: number, x: any) => x?.id;
}
