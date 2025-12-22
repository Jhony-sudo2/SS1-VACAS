import { Component } from '@angular/core';
import { CitaService } from '../../services/Cita/cita.service';
import { AuthService } from '../../services/Auth/auth.service';
import { Cita, Estado } from '../../interfaces/Cita';
import { Rol } from '../../interfaces/Usuario';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-citas',
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.css'
})
export class MisCitasComponent {
  Estado = Estado;
  citas: Cita[] = [];
  filtradas: Cita[] = [];
  cargando = false;
  filtroEstado: 'TODAS' | 'AGENDADA' | 'PAGADA' | 'COMPLETADA' | 'CANCELADA' = 'TODAS';
  q = '';
  esPaciente = false;

  constructor(private servicio: CitaService, private auth: AuthService) { }

  ngOnInit(): void {
    const usuario = this.auth.getCurrentUser();
    if (!usuario?.id) return;

    this.esPaciente = usuario.rol === Rol.PACIENTE;
    this.cargando = true;
    const obs = this.esPaciente
      ? this.servicio.myCitasPaciente(usuario.id)
      : this.servicio.myCitas(usuario.id);

    obs.subscribe({
      next: (resp) => {
        this.citas = resp ?? [];
        this.aplicarFiltros();
      },
      error: (err) => {
        this.citas = [];
        this.filtradas = [];
        Swal.fire({
          title: 'Error',
          text: err.error || 'No se pudieron cargar las citas.',
          icon: 'error'
        });
      },
      complete: () => (this.cargando = false)
    });
  }

  updateState(id: number, estado: Estado): void {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Deseas actualizar el estado de la cita?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((r) => {
      if (!r.isConfirmed) return;

      this.servicio.updateState(id, estado).subscribe({
        next: () => {
          Swal.fire({ title: 'OK', text: 'ESTADO ACTUALIZADO', icon: 'success' });

          // Actualizar en la lista local (sin recargar)
          this.citas = this.citas.map((c) => (c.id === id ? { ...c, estado } : c));
          this.aplicarFiltros();
        },
        error: (err) => {
          Swal.fire({ title: 'Error', text: err?.error || 'No se pudo actualizar el estado', icon: 'error' });
        }
      });
    });
  }

  // Reglas de UI
  puedeCancelar(c: Cita): boolean {
    // paciente solo cancela si aún no está completada/cancelada
    return this.esPaciente && (c.estado === Estado.AGENDADA || c.estado === Estado.PAGADA);
  }

  puedeCompletar(c: Cita): boolean {
    // empleado solo completa si aún no está completada/cancelada
    return !this.esPaciente && (c.estado === Estado.AGENDADA || c.estado === Estado.PAGADA);
  }

  // --- Helpers de formato ---

  estadoLabel(e: Estado): string {
    // Enum numérico -> texto
    // Si tu backend manda string, este switch también funciona si lo casteas
    console.log(e);
    switch (e) {
      case Estado.AGENDADA: return 'AGENDADA';
      case Estado.CANCELADA: return 'CANCELADA';
      case Estado.PAGADA: return 'PAGADA';
      case Estado.COMPLETADA: return 'COMPLETADA';
      default: return 'DESCONOCIDO';
    }
  }

  estadoBadgeClass(e: Estado): string {
    // Clases tipo sakai
    const base = 'px-3 py-1 rounded-full text-xs font-bold border';
    switch (e) {
      case Estado.AGENDADA:
        return `${base} bg-blue-500/15 text-blue-300 border-blue-500/30`;
      case Estado.PAGADA:
        return `${base} bg-emerald-500/15 text-emerald-300 border-emerald-500/30`;
      case Estado.COMPLETADA:
        return `${base} bg-slate-500/15 text-slate-200 border-slate-500/30`;
      case Estado.CANCELADA:
        return `${base} bg-red-500/15 text-red-300 border-red-500/30`;
      default:
        return `${base} bg-slate-500/15 text-slate-200 border-slate-500/30`;
    }
  }

  fechaLabel(fechaIso: string): string {
    // Espera "2025-12-22T08:00:00" (sin Z)
    if (!fechaIso) return '';
    const [d, t] = fechaIso.split('T');
    const hhmm = (t || '').substring(0, 5);
    return `${d} ${hhmm}`;
  }

  nombreEmpleado(c: Cita): string {
    // Ajusta según tu interface Empleado
    return (c?.empleado as any)?.nombre ?? 'Empleado';
  }

  nombrePaciente(c: Cita): string {
    // Ajusta según tu interface Paciente
    return (c?.paciente as any)?.nombre ?? 'Paciente';
  }

  // --- Filtros ---
  aplicarFiltros(): void {
    const q = (this.q || '').trim().toLowerCase();

    this.filtradas = (this.citas ?? []).filter((c) => {
      const estOk =
        this.filtroEstado === 'TODAS'
          ? true
          : this.estadoLabel(c.estado) === this.filtroEstado;

      if (!estOk) return false;

      if (!q) return true;

      const emp = this.nombreEmpleado(c).toLowerCase();
      const pac = this.nombrePaciente(c).toLowerCase();
      const f = (c.fecha || '').toLowerCase();
      return emp.includes(q) || pac.includes(q) || f.includes(q);
    });
  }

  // --- UI ---
  trackById = (_: number, c: Cita) => c.id;
}
