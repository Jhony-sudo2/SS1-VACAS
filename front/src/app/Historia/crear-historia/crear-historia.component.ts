import { Component } from '@angular/core';
import { HistoriaService } from '../../services/Historia/historia.service';
import { AuthService } from '../../services/Auth/auth.service';
import { Paciente } from '../../interfaces/Usuario';
import { using } from 'rxjs';
import { UserService } from '../../services/User/user.service';
import Swal from 'sweetalert2';
import { Antecedentes, Consumo, Enfoque, EstadoEmocion, EstadoInicial, Frecuencia, HistoriaCreate, HistoriaPersonal, Modalidad } from '../../interfaces/Historia';
import { Estado } from '../../interfaces/Cita';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-historia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-historia.component.html',
  styleUrl: './crear-historia.component.css'
})
export class CrearHistoriaComponent {
  pacientes: Paciente[] = [];
  idEmpleado = 0;

  // enums para el HTML
  Modalidad = Modalidad;
  Frecuencia = Frecuencia;
  Enfoque = Enfoque;
  Consumo = Consumo;
  EstadoEmocion = EstadoEmocion;
  Estado = Estado;

  // opciones para selects
  modalidades = [
    { label: 'INDIVIDUAL', value: Modalidad.INDIVIDUAL },
    { label: 'FAMILIAR', value: Modalidad.FAMILIAR },
    { label: 'PAREJA', value: Modalidad.PAREJA },
    { label: 'GRUPO', value: Modalidad.GRUPO }
  ];

  frecuencias = [
    { label: 'SEMANAL', value: Frecuencia.SEMANAL },
    { label: 'QUINCENAL', value: Frecuencia.QUINCENAL },
    { label: 'MENSUAL', value: Frecuencia.MENSUAL }
  ];

  enfoques = [
    { label: 'COGNITIVO', value: Enfoque.COGNITIVO },
    { label: 'SISTEMICO', value: Enfoque.SISTEMICO },
    { label: 'PSICODINAMICO', value: Enfoque.PSICODINAMICO },
    { label: 'HUMANISTA', value: Enfoque.HUMANISTA },
    { label: 'INTEGRATIVO', value: Enfoque.INTEGRATIVO }
  ];

  consumos = [
    { label: 'NUNCA', value: Consumo.NUNCA },
    { label: 'OCASIONAL', value: Consumo.OCASIONAL },
    { label: 'MODERADO', value: Consumo.MODERADO },
    { label: 'EXCESIVO', value: Consumo.EXCESIVO }
  ];

  emociones = [
    { label: 'MUY BAJO', value: EstadoEmocion.MUYBAJO },
    { label: 'BAJO', value: EstadoEmocion.BAJO },
    { label: 'NORMAL', value: EstadoEmocion.NORMAL },
    { label: 'ALTO', value: EstadoEmocion.ALTO },
    { label: 'MUY ALTO', value: EstadoEmocion.MUYALTO }
  ];

  // UI
  loading = false;

  // form fields (HistoriaCreate)
  pacienteId: number | null = null;
  fechaApertura = ''; // yyyy-MM-dd
  motivoConsulta = '';
  procedencia = '';
  modalidad: Modalidad = Modalidad.INDIVIDUAL;
  sesiones = 10;
  duracion = 60; // minutos
  costoSesion = 0;
  frecuencia: Frecuencia = Frecuencia.SEMANAL;
  enfoque: Enfoque = Enfoque.COGNITIVO;

  // HistoriaPersonal
  personal: Omit<HistoriaPersonal, 'historia'> & { historia: any } = {
    id: undefined,
    desarrollo: '',
    historiaAcademica: '',
    historiaMedica: '',
    medicacionActual: '',
    alcohol: Consumo.NUNCA,
    tabaco: Consumo.NUNCA,
    drogas: Consumo.NUNCA,
    tratamientosPrevios: '',
    hospitalizaciones: '',
    historia: null
  };

  // Antecedentes
  antecedente: Omit<Antecedentes, 'paciente'> & { paciente: any } = {
    id: undefined,
    estructura: '',
    trastornos: '',
    eventos: '',
    paciente: null
  };

  // EstadoInicial
  estadoInicial: Omit<EstadoInicial, 'historia'> & { historia: any } = {
    id: undefined,
    animo: EstadoEmocion.NORMAL,
    ansiedad: EstadoEmocion.NORMAL,
    funcionamientosocial: EstadoEmocion.NORMAL,
    suenio: EstadoEmocion.NORMAL,
    apetito: EstadoEmocion.NORMAL, 
    observaciones: '',
    historia: null
  };

  constructor(
    private servicio: HistoriaService,
    private auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getCurrentUser();
    if (usuario?.id) this.idEmpleado = usuario.id;

    this.userService.getAllPacientes().subscribe({
      next: (response) => (this.pacientes = response ?? []),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar pacientes', icon: 'error' })
    });
  }

  private validar(): string | null {
    if (!this.idEmpleado) return 'No se detectó el empleado logueado.';
    if (!this.pacienteId) return 'Selecciona un paciente.';
    if (!this.fechaApertura) return 'Selecciona la fecha de apertura.';
    if (!this.motivoConsulta.trim()) return 'Ingresa el motivo de consulta.';
    if (!this.procedencia.trim()) return 'Ingresa la procedencia.';
    if (this.sesiones <= 0) return 'Sesiones debe ser mayor a 0.';
    if (this.duracion <= 0) return 'Duración debe ser mayor a 0.';
    if (this.costoSesion < 0) return 'Costo sesión no puede ser negativo.';
    return null;
  }

  guardarHistoria(): void {
    const msg = this.validar();
    if (msg) {
      Swal.fire({ title: 'Validación', text: msg, icon: 'warning' });
      return;
    }

    const historiaCreate: HistoriaCreate = {
      empleadoId: this.idEmpleado,
      pacienteId: this.pacienteId!,
      fechaApertura: this.fechaApertura, // string yyyy-MM-dd
      motivoConsulta: this.motivoConsulta.trim(),
      procedencia: this.procedencia.trim(),
      modalidad: this.modalidad,
      sesiones: Number(this.sesiones),
      duracion: Number(this.duracion),
      costoSesion: Number(this.costoSesion),
      frecuencia: this.frecuencia,
      enfoque: this.enfoque
    };

    const personalPayload: HistoriaPersonal = { ...(this.personal as any), historia: null };
    const antecedentePayload: Antecedentes = { ...(this.antecedente as any), paciente: null };
    const estadoInicialPayload: EstadoInicial = { ...(this.estadoInicial as any), historia: null };

    this.loading = true;
    this.servicio.saveHistoria(historiaCreate, personalPayload, antecedentePayload, estadoInicialPayload).subscribe({
      next: () => {
        Swal.fire({ title: 'Listo', text: 'Historia creada correctamente.', icon: 'success' });
        this.resetForm();
      },
      error: (err) => {Swal.fire({ title: 'Error', text: err?.error || 'No se pudo crear la historia', icon: 'error' }),
      this.loading = true
      },
      complete: () => (this.loading = false)
    });
  }

  resetForm(): void {
    this.pacienteId = null;
    this.fechaApertura = '';
    this.motivoConsulta = '';
    this.procedencia = '';
    this.modalidad = Modalidad.INDIVIDUAL;
    this.sesiones = 10;
    this.duracion = 60;
    this.costoSesion = 0;
    this.frecuencia = Frecuencia.SEMANAL;
    this.enfoque = Enfoque.COGNITIVO;

    this.personal = {
      id: undefined,
      desarrollo: '',
      historiaAcademica: '',
      historiaMedica: '',
      medicacionActual: '',
      alcohol: Consumo.NUNCA,
      tabaco: Consumo.NUNCA,
      drogas: Consumo.NUNCA,
      tratamientosPrevios: '',
      hospitalizaciones: '',
      historia: null
    };

    this.antecedente = {
      id: undefined,
      estructura: '',
      trastornos: '',
      eventos: '',
      paciente: null
    };

    this.estadoInicial = {
      id: undefined,
      animo: EstadoEmocion.NORMAL,
      ansiedad: EstadoEmocion.NORMAL,
      funcionamientosocial: EstadoEmocion.NORMAL,
      suenio: EstadoEmocion.NORMAL,
      apetito: EstadoEmocion.NORMAL,
      observaciones: '',
      historia: null
    };
  }
}
