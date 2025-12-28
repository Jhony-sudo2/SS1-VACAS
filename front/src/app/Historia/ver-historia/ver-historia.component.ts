import { Component } from '@angular/core';
import { HistoriaService } from '../../services/Historia/historia.service';
import { AuthService } from '../../services/Auth/auth.service';
import { Enfoque, EstadoHistoria, Frecuencia, Historia, HistoriaDetail, Modalidad } from '../../interfaces/Historia';
import { Rol } from '../../interfaces/Usuario';
import Swal from 'sweetalert2';
import { Estado } from '../../interfaces/Cita';
import { CommonModule } from '@angular/common';
import { PdGenerator } from '../../utils/PdfMake';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ver-historia',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './ver-historia.component.html',
  styleUrl: './ver-historia.component.css'
})
export class VerHistoriaComponent {
  historias: Historia[] = [];

  cargando = false;
  esPaciente = false;

  // cache de detalles
  detailById = new Map<number, HistoriaDetail>();
  loadingDetailId: number | null = null;

  expandedId: number | null = null;
  pdf = new PdGenerator()
  constructor(private servicio: HistoriaService, private auth: AuthService) { }

  ngOnInit(): void {
    const usuario = this.auth.getCurrentUser();
    if (!usuario?.id) return;

    this.esPaciente = usuario.rol === Rol.PACIENTE;

    this.cargando = true;
    const obs = this.esPaciente
      ? this.servicio.getHistoriasPaciente(usuario.id)
      : this.servicio.getHistoriasEmpleado(usuario.id);

    obs.subscribe({
      next: (response) => (this.historias = response ?? []),
      error: (err) => {
        this.historias = [];
        Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar historias', icon: 'error' });
      },
      complete: () => (this.cargando = false)
    });
  }

  getNombreEmpleado(h: Historia): string {
    return (h?.empleado as any)?.nombre ?? 'Empleado';
  }

  getNombrePaciente(h: Historia): string {
    return (h?.paciente as any)?.nombre ?? 'Paciente';
  }

  estadoHistoriaLabel(e: EstadoHistoria): string {
    switch (e) {
      case EstadoHistoria.ACTIVO: return 'ACTIVO';
      case EstadoHistoria.ALTA: return 'ALTA';
      default: return 'DESCONOCIDO';
    }
  }

  badgeEstadoHistoriaClass(e: EstadoHistoria): string {
    const base = 'px-3 py-1 rounded-full text-xs font-bold border';
    switch (e) {
      case EstadoHistoria.ACTIVO:
        return `${base} bg-emerald-500/15 text-emerald-300 border-emerald-500/30`;
      case EstadoHistoria.ALTA:
        return `${base} bg-slate-500/15 text-slate-200 border-slate-500/30`;
      default:
        return `${base} bg-slate-500/15 text-slate-200 border-slate-500/30`;
    }
  }

  formatFecha(fechaIso: string): string {
    if (!fechaIso) return '';
    const [d, t] = fechaIso.split('T');
    if (!t) return d;
    return `${d} ${t.substring(0, 5)}`;
  }

  toggleDetalles(historiaId: number | undefined): void {
    if (!historiaId) return;

    if (this.expandedId === historiaId) {
      this.expandedId = null;
      return;
    }

    this.expandedId = historiaId;

    if (this.detailById.has(historiaId)) return;

    this.loadingDetailId = historiaId;

    this.servicio.getDetailsHistoria(historiaId).subscribe({
      next: (detail) => {
        if (!detail) {
          Swal.fire({ title: 'Info', text: 'No se encontraron detalles.', icon: 'info' });
          return;
        }
        this.detailById.set(historiaId, detail);
      },
      error: (err) => {
        Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar los detalles', icon: 'error' });
      },
      complete: () => (this.loadingDetailId = null)
    });
  }

  getDetail(historiaId: number | undefined): HistoriaDetail | null {
    if (!historiaId) return null;
    return this.detailById.get(historiaId) ?? null;
  }

  generarPdf(id:number){
    this.servicio.getDetailsHistoria(id).subscribe({
      next:(response)=>{
        if(response)
          this.pdf.pdfHistoria(response,'open')
      },
      error:(err)=>{Swal.fire({title:'error',text:err.error,icon:'error'})}
    })
  }

  trackByHistoriaId = (_: number, h: Historia) => h.id;
  trackBySesionId = (_: number, s: any) => s.id;
}
