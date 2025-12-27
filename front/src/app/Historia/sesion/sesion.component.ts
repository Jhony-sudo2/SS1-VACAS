import { Component } from '@angular/core';
import { HistoriaService } from '../../services/Historia/historia.service';
import { ActivatedRoute } from '@angular/router';
import { EstadoHistoria, Historia } from '../../interfaces/Historia';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/Auth/auth.service';
import { MedicamentoService } from '../../services/Medicamento/medicamento.service';
import { Medicamento } from '../../interfaces/Medicamento';
import { Receta, Tarea } from '../../interfaces/Receta';
import { ImpresionDiagnostica, pruebas, Sesion, SesionDetail } from '../../interfaces/Sesion';
import { Estado } from '../../interfaces/Cita';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sesion.component.html',
  styleUrl: './sesion.component.css'
})
export class SesionComponent  {
  historia: Historia = { id: 0 } as Historia;

  empleadoId = 0;

  // Sesiones de la historia
  sesiones: Sesion[] = [];

  // Para agendar
  fechaAgenda = '';            // yyyy-MM-dd
  horariosDisponibles: string[] = []; // "yyyy-MM-ddTHH:mm:ss"
  horarioSeleccionado: string | null = null;

  // Detalle de sesión seleccionada
  sesionSeleccionada: Sesion | null = null;
  detalle: SesionDetail | null = null;

  // Medicamentos para receta
  medicamentos: Medicamento[] = [];

  // UI
  cargandoHistoria = false;
  cargandoSesiones = false;
  cargandoDisponibilidad = false;
  guardando = false;

  // Tabs
  tab: 'SESIONES' | 'GESTION' | 'ALTA' = 'SESIONES';

  // Forms: Prueba
  formPrueba: any = {
    fecha: '',          // yyyy-MM-dd
    resultado: null,
    interpretacion: ''
  };

  // Forms: Impresión diagnóstica
  formImpresion: ImpresionDiagnostica = {
    id: undefined,
    sesion: null as any, // backend lo asigna por sesion enviada
    descripcion: '',
    factoresPredisponentes: '',
    factoresPrecipitantes: '',
    factoresMantenedores: '',
    nivelFuncionamiento: ''
  };

  // Forms: Tarea
  formTarea: any = {
    instrucciones: '',
    estado: false
  };

  // Forms: Recetas (lista)
  recetasDraft: Array<{ medicamentoId: number | null; indicaciones: string,cantidad:number }> = [
    { medicamentoId: null, indicaciones: '' ,cantidad:0}
  ];

  // Exponer enums al HTML
  Estado = Estado;
  EstadoHistoria = EstadoHistoria;

  constructor(
    private servicio: HistoriaService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private medicamentoService: MedicamentoService
  ) {}

  ngOnInit(): void {
    const u = this.auth.getCurrentUser();
    if (u?.id) this.empleadoId = u.id;

    const historiaId = Number(this.route.snapshot.paramMap.get('historia'));

    this.cargandoHistoria = true;
    this.servicio.getById(historiaId).subscribe({
      next: (resp) => {
        this.historia = resp;
        this.cargarSesiones();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cargar la historia', icon: 'error' }),
      complete: () => (this.cargandoHistoria = false)
    });

    this.medicamentoService.findAll().subscribe({
      next: (resp) => (this.medicamentos = resp ?? []),
      error: () => (this.medicamentos = [])
    });
  }

  // ========= CARGA SESIONES =========
  cargarSesiones(): void {
    if (!this.historia?.id) return;

    this.cargandoSesiones = true;
    
    // ✅ Recomendado: crea/usa un endpoint para listar sesiones por historia
    // Ej: GET /historia/sesiones?id=HISTORIA_ID
    this.servicio.getSesionesHistoria(this.historia.id as any).subscribe({
      next: (resp) => (this.sesiones = resp ?? []),
      error: (err) => {
        this.sesiones = [];
        Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar sesiones', icon: 'error' });
      },
      complete: () => (this.cargandoSesiones = false)
    });
  }

  // ========= DISPONIBILIDAD =========
  consultarDisponibilidad(): void {
    this.horariosDisponibles = [];
    this.horarioSeleccionado = null;

    if (!this.empleadoId) {
      Swal.fire({ title: 'Validación', text: 'No se detectó empleado.', icon: 'warning' });
      return;
    }
    if (!this.fechaAgenda) {
      Swal.fire({ title: 'Validación', text: 'Selecciona una fecha.', icon: 'warning' });
      return;
    }
    if (!this.historia?.duracion || this.historia.duracion <= 0) {
      Swal.fire({ title: 'Validación', text: 'La historia no tiene duración válida.', icon: 'warning' });
      return;
    }

    // Servicio espera fecha (día) y duración en minutos
    this.cargandoDisponibilidad = true;

    this.servicio.getHorarios(
      this.empleadoId,
      this.fechaAgenda,          // yyyy-MM-dd
      this.historia.duracion     // min
    ).subscribe({
      next: (resp) => {
        this.horariosDisponibles = resp;
        if (this.horariosDisponibles.length === 0) {
          Swal.fire({ title: 'Sin horarios', text: 'No hay disponibilidad para esa fecha.', icon: 'info' });
        }
      },
      error: (err) => {
        this.horariosDisponibles = [];
        Swal.fire({ title: 'Error', text: err?.error || 'No se pudo consultar disponibilidad', icon: 'error' });
      },
      complete: () => (this.cargandoDisponibilidad = false)
    });
  }

  horaLabel(iso: string): string {
    if (!iso) return '';
    const t = iso.includes('T') ? iso.split('T')[1] : iso;
    return (t || '').substring(0, 5);
  }

  formatFechaHora(iso: string): string {
    if (!iso) return '';
    const [d] = iso.split('T');
    return `${d} ${this.horaLabel(iso)}`;
  }

  slotClass(iso: string): string {
    const selected = this.horarioSeleccionado === iso;
    return [
      'px-3 py-2 rounded-lg text-sm font-semibold border transition-all',
      selected
        ? 'bg-emerald-600 border-emerald-600 text-white shadow'
        : 'bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800'
    ].join(' ');
  }

  // ========= AGENDAR SESION =========
  agendarSesion(): void {
    if (this.historia?.estado === EstadoHistoria.ALTA) {
      Swal.fire({ title: 'Info', text: 'La historia ya está en ALTA.', icon: 'info' });
      return;
    }
    if (!this.horarioSeleccionado) {
      Swal.fire({ title: 'Validación', text: 'Selecciona un horario.', icon: 'warning' });
      return;
    }
    if (!this.historia?.id) return;

    const numero = (this.sesiones?.length ?? 0) + 1;

    if (this.historia?.sesiones && numero > this.historia.sesiones) {
      Swal.fire({
        title: 'Validación',
        text: `Ya alcanzaste el máximo de sesiones (${this.historia.sesiones}).`,
        icon: 'warning'
      });
      return;
    }

    // Construir sesión (tu interface no tiene fecha, se envía como extra)
    const payload: any = {
      id: undefined,
      historia: this.historia,
      numero,
      estado: Estado.AGENDADA,
      justificacion: '',
      temas: '',
      respuestas: '',
      observaciones: '',
      estadoPago: false,
      fecha: this.horarioSeleccionado // ✅ LocalDateTime string
    };

    this.guardando = true;
    this.servicio.guardarSesion(payload as Sesion).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Sesión agendada.', icon: 'success' });
        this.horarioSeleccionado = null;
        this.cargarSesiones();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo agendar', icon: 'error' }),
      complete: () => (this.guardando = false)
    });
  }

  // ========= DETALLE SESION =========
  verDetalleSesion(s: Sesion): void {
    this.sesionSeleccionada = s;
    this.detalle = null;
    this.tab = 'GESTION';

    if (!s?.id) return;

    this.servicio.getDetails(s.id as any).subscribe({
      next: (resp) => {
        this.detalle = resp;

        // precargar impresión si ya existe
        if (resp?.impresionDiagnostica) {
          this.formImpresion = { ...resp.impresionDiagnostica } as any;
        } else {
          this.formImpresion = {
            id: undefined,
            sesion: null as any,
            descripcion: '',
            factoresPredisponentes: '',
            factoresPrecipitantes: '',
            factoresMantenedores: '',
            nivelFuncionamiento: ''
          };
        }
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cargar detalle', icon: 'error' })
    });
  }

  // ========= GUARDAR PRUEBA =========
  guardarPrueba(): void {
    if (!this.sesionSeleccionada?.id) return;

    if (!this.formPrueba.fecha) {
      Swal.fire({ title: 'Validación', text: 'Selecciona fecha de la prueba.', icon: 'warning' });
      return;
    }
    if (this.formPrueba.resultado === null || this.formPrueba.resultado === undefined) {
      Swal.fire({ title: 'Validación', text: 'Ingresa resultado.', icon: 'warning' });
      return;
    }

    const payload: pruebas = {
      id: undefined,
      sesion: this.sesionSeleccionada as any,
      fecha: this.formPrueba.fecha, // string
      resultado: Number(this.formPrueba.resultado),
      interpretacion: (this.formPrueba.interpretacion || '').trim()
    };

    this.guardando = true;
    this.servicio.guardarPrueba(payload).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Prueba guardada.', icon: 'success' });
        this.formPrueba = { fecha: '', resultado: null, interpretacion: '' };
        this.refrescarDetalleSesion();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo guardar prueba', icon: 'error' }),
      complete: () => (this.guardando = false)
    });
  }

  // ========= GUARDAR IMPRESION =========
  guardarImpresion(): void {
    if (!this.sesionSeleccionada?.id) return;

    const payload: ImpresionDiagnostica = {
      ...(this.formImpresion as any),
      id: undefined, // si no tenés update, siempre crea (si tenés update, quitá esto)
      sesion: this.sesionSeleccionada as any
    };

    if (!payload.descripcion.trim()) {
      Swal.fire({ title: 'Validación', text: 'Ingresa la descripción.', icon: 'warning' });
      return;
    }

    this.guardando = true;
    this.servicio.guardarImpresion(payload).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Impresión guardada.', icon: 'success' });
        this.refrescarDetalleSesion();
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo guardar impresión', icon: 'error' }),
      complete: () => (this.guardando = false)
    });
  }

  // ========= GUARDAR TAREA =========
  guardarTarea(): void {
    if (!this.historia?.paciente) {
      Swal.fire({ title: 'Error', text: 'No hay paciente en la historia.', icon: 'error' });
      return;
    }
    const instrucciones = (this.formTarea.instrucciones || '').trim();
    if (!instrucciones) {
      Swal.fire({ title: 'Validación', text: 'Ingresa instrucciones.', icon: 'warning' });
      return;
    }

    const payload: Tarea = {
      id: undefined,
      paciente: this.historia.paciente as any,
      instrucciones,
      estado: !!this.formTarea.estado
    };

    this.guardando = true;
    this.servicio.guardarTarea(payload).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Tarea guardada.', icon: 'success' });
        this.formTarea = { instrucciones: '', estado: false };
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo guardar tarea', icon: 'error' }),
      complete: () => (this.guardando = false)
    });
  }

  // ========= GUARDAR RECETAS =========
  addRecetaRow(): void {
    this.recetasDraft = [...this.recetasDraft, { medicamentoId: null, indicaciones: '',cantidad:0 }];
  }

  removeRecetaRow(i: number): void {
    this.recetasDraft = this.recetasDraft.filter((_, idx) => idx !== i);
    if (this.recetasDraft.length === 0) this.addRecetaRow();
  }

  guardarRecetas(): void {
    if (!this.historia?.paciente) {
      Swal.fire({ title: 'Error', text: 'No hay paciente en la historia.', icon: 'error' });
      return;
    }

    const filasValidas = this.recetasDraft
      .map((r) => ({
        medicamentoId: r.medicamentoId,
        indicaciones: (r.indicaciones || '').trim(),
        cantidad: r.cantidad
      }))
      .filter((r) => !!r.medicamentoId && !!r.indicaciones);

    if (filasValidas.length === 0) {
      Swal.fire({ title: 'Validación', text: 'Agrega al menos una receta válida.', icon: 'warning' });
      return;
    }

    const recetas: Receta[] = filasValidas.map((r) => {
      const med = this.medicamentos.find((m) => (m as any).id === r.medicamentoId);
      return {
        id: undefined,
        medicamento: med as any,
        paciente: this.historia.paciente as any, 
        indicaciones: r.indicaciones,
        sesion:this.sesionSeleccionada?.id,
        cantidad: r.cantidad
      } as any;
    });

    this.guardando = true;
    this.servicio.guardarReceta(recetas).subscribe({
      next: () => {
        Swal.fire({ title: 'OK', text: 'Receta(s) guardada(s).', icon: 'success' });
        this.recetasDraft = [{ medicamentoId: null, indicaciones: '',cantidad:0 }];
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo guardar receta', icon: 'error' }),
      complete: () => (this.guardando = false)
    });
  }

  // ========= DAR ALTA =========
  motivoAlta = '';

  darAlta(): void {
    if (!this.historia?.id) return;

    const motivo = (this.motivoAlta || '').trim();
    if (!motivo) {
      Swal.fire({ title: 'Validación', text: 'Ingresa el motivo de alta.', icon: 'warning' });
      return;
    }

    Swal.fire({
      title: 'Confirmar',
      text: '¿Deseas dar de alta esta historia?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((r) => {
      if (!r.isConfirmed) return;

      this.guardando = true;
      this.servicio.darAlta(this.historia.id as any, motivo).subscribe({
        next: () => {
          Swal.fire({ title: 'OK', text: 'Historia dada de alta.', icon: 'success' });
          (this.historia as any).estado = this.EstadoHistoria.ALTA;
          (this.historia as any).motivoAlta = motivo;
        },
        error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo dar de alta', icon: 'error' }),
        complete: () => (this.guardando = false)
      });
    });
  }

  private refrescarDetalleSesion(): void {
    if (!this.sesionSeleccionada?.id) return;
    this.servicio.getDetails(this.sesionSeleccionada.id as any).subscribe({
      next: (resp) => (this.detalle = resp),
      error: () => {}
    });
  }
}