import { Component } from '@angular/core';
import { CitaService } from '../../services/Cita/cita.service';
import { Servicio } from '../../interfaces/Area';
import { GeneralService } from '../../services/General/general.service';
import { AuthService } from '../../services/Auth/auth.service';
import Swal from 'sweetalert2';
import { Disponibilidad } from '../../interfaces/Cita';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agendar',
  imports: [CommonModule,
    FormsModule,
  ],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent {
  servicios: Servicio[] = [];

  pacienteId = 0;

  // Form
  servicioId: number | null = null;
  fecha: string = ''; // yyyy-MM-dd (input type="date")

  // Data
  disponibilidad: Disponibilidad[] = [];
  cargando = false;

  // Selección
  empleadoSeleccionadoId: number | null = null;
  horarioSeleccionadoIso: string | null = null;

  constructor(
    private citaService: CitaService,
    private general: GeneralService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.general.getAllServicios().subscribe({
      next: (resp) => (this.servicios = resp ?? []),
      error: () => (this.servicios = [])
    });

    const user = this.auth.getCurrentUser();
    if (user?.id) this.pacienteId = user.id;
    console.log(this.pacienteId);
    
  }

  onChangeFiltros(): void {
    // Limpia selección previa cuando cambie algo
    this.disponibilidad = [];
    this.empleadoSeleccionadoId = null;
    this.horarioSeleccionadoIso = null;

    if (!this.servicioId || !this.fecha) return;

    this.cargando = true;
    this.citaService.getHorariosDisponibles(this.servicioId, this.fecha).subscribe({
      next: (resp) => {
        this.disponibilidad = resp ?? [];
        if (this.disponibilidad.length === 0) {
          Swal.fire({
            title: 'Sin horarios',
            text: 'No hay horarios disponibles para esa fecha y servicio.',
            icon: 'info'
          });
        }
      },
      error: (err) => {
        this.disponibilidad = [];
        Swal.fire({
          title: 'Error',
          text: err?.error || 'No se pudo consultar disponibilidad.',
          icon: 'error'
        });
      },
      complete: () => (this.cargando = false)
    });
  }

  seleccionarHorario(empleadoId: number, iso: string): void {
    this.empleadoSeleccionadoId = empleadoId;
    this.horarioSeleccionadoIso = iso;
  }

  horaLabel(iso: string): string {
    // ISO -> HH:mm
    if (!iso) return '';
    const t = iso.includes('T') ? iso.split('T')[1] : iso;
    return (t || '').substring(0, 5);
  }

  formatSeleccion(): string {
    if (!this.horarioSeleccionadoIso) return '';
    // muestra fecha + hora
    const [d, t] = this.horarioSeleccionadoIso.split('T');
    return `${d} ${this.horaLabel(this.horarioSeleccionadoIso)}`;
  }

  slotBtnClass(empleadoId: number, iso: string): string {
    const selected = this.empleadoSeleccionadoId === empleadoId && this.horarioSeleccionadoIso === iso;
    return [
      'px-3 py-2 rounded-lg text-sm font-semibold border transition-all',
      selected
        ? 'bg-emerald-600 border-emerald-600 text-white shadow'
        : 'bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800'
    ].join(' ');
  }

  agendar(): void {
    if (!this.pacienteId) {
      Swal.fire({ title: 'Error', text: 'No se detectó el paciente logueado.', icon: 'error' });
      return;
    }
    if (!this.servicioId) {
      Swal.fire({ title: 'Validación', text: 'Selecciona un servicio.', icon: 'warning' });
      return;
    }
    if (!this.fecha) {
      Swal.fire({ title: 'Validación', text: 'Selecciona una fecha.', icon: 'warning' });
      return;
    }
    if (!this.empleadoSeleccionadoId || !this.horarioSeleccionadoIso) {
      Swal.fire({ title: 'Validación', text: 'Selecciona un horario disponible.', icon: 'warning' });
      return;
    }

    const fechaDate = this.horarioSeleccionadoIso.length === 16
    ? this.horarioSeleccionadoIso + ':00'
    : this.horarioSeleccionadoIso;
    console.log(fechaDate);
    
    this.citaService.agendar(
      this.pacienteId,
      this.empleadoSeleccionadoId,
      fechaDate,
      this.servicioId
    ).subscribe({
      next: () => {
        Swal.fire({ title: 'Listo', text: 'Cita agendada correctamente.', icon: 'success' });
        // refrescar disponibilidad
        this.onChangeFiltros();
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err?.error || 'No se pudo agendar la cita.',
          icon: 'error'
        });
      }
    }); 
  }
}