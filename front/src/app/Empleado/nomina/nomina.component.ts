import { Component } from '@angular/core';
import { GeneralService } from '../../services/General/general.service';
import { Dashboard, Empresa } from '../../interfaces/Empresa';
import Swal from 'sweetalert2';
import { Area, Servicio } from '../../interfaces/Area';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/Auth/auth.service';
import { Medicamento } from '../../interfaces/Medicamento';

@Component({
  selector: 'app-nomina',
  imports: [CommonModule, FormsModule],
  templateUrl: './nomina.component.html',
  styleUrl: './nomina.component.css'
})
export class MainComponent {
  dashboard: Dashboard = {} as Dashboard;

  empresa: Empresa | null = null;
  areas: Area[] = [];
  servicios: Servicio[] = [];
  medicamentos: Medicamento[] = []

  q = '';
  cargando = false;
  logeado: boolean = false
  constructor(private servicio: GeneralService, private authService: AuthService) { }

  ngOnInit(): void {
    const usuario = this.authService.getCurrentUser()
    if (usuario)
      this.logeado = true
    this.cargando = true;
    this.servicio.getDashboard().subscribe({
      next: (response) => {
        this.dashboard = response;

        this.empresa = response?.empresa ?? null;
        const a = response?.areas;
        this.areas = Array.isArray(a) ? a : (a ? [a] : []);

        const s = response?.servicios;
        this.servicios = Array.isArray(s) ? s : (s ? [s] : []);
        this.medicamentos = response.medicamentos
      },
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo cargar la información', icon: 'error' }),
      complete: () => (this.cargando = false)
    });
  }

  get areasFiltradas(): Area[] {
    const t = this.q.trim().toLowerCase();
    if (!t) return this.areas;

    return this.areas.filter(a =>
      (a?.nombre ?? '').toString().toLowerCase().includes(t) ||
      (a?.descripcion ?? '').toString().toLowerCase().includes(t)
    );
  }

  get serviciosFiltrados(): Servicio[] {
    const t = this.q.trim().toLowerCase();
    if (!t) return this.servicios;

    return this.servicios.filter(s =>
      (s?.nombre ?? '').toString().toLowerCase().includes(t) ||
      (s?.descripcion ?? '').toString().toLowerCase().includes(t)
    );
  }

  // por si viene base64 o url: ambos funcionan directo en [src]
  imgSrc(src?: string): string {
    return src?.trim() ? src : '';
  }

  get medicamentosFiltrados(): Medicamento[] {
    const t = this.q.trim().toLowerCase();
    if (!t) return this.medicamentos;

    return this.medicamentos.filter(m =>
      (m?.nombre ?? '').toString().toLowerCase().includes(t)
    );
  }

  esBajoStock(m: Medicamento): boolean {
    return (m.stock ?? 0) <= (m.minimo ?? 0);
  }
}
