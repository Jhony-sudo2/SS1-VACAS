import { Component } from '@angular/core';
import { ReportesService } from '../../services/Reporte/reportes.service';
import { AtencionEmpleadoDTO, MedicamentoMinimo, ReporteFinancieroDTO, TopMedicamentoDTO } from '../../interfaces/Reporte';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PdGenerator } from '../../utils/PdfMake';
import { GeneralService } from '../../services/General/general.service';
import { Empresa } from '../../interfaces/Empresa';

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  desde = '';
  hasta = '';
  top = 10;


  financiero: ReporteFinancieroDTO | null = null;
  minimos: MedicamentoMinimo[] = [];
  topMedicamentos: TopMedicamentoDTO[] = [];
  atencion: AtencionEmpleadoDTO[] = [];
  costoNominaRRHH: number | null = null;

  loading = false;

  pdfContructor = new PdGenerator()
  empresa: Empresa = { id: 0 } as Empresa
  constructor(private servicio: ReportesService, private general: GeneralService) { }

  ngOnInit(): void {
    this.general.getEmpresa().subscribe({
      next: (r) => { this.empresa = r },
      error: (e) => { Swal.fire({ title: 'error', text: e.error, icon: 'error' }) }
    })
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    this.desde = `${y}-${m}-01`;
    this.hasta = this.lastDayOfMonthISO(y, Number(m));
    this.cargarTodo();

  }
  generarPdf() {
    this.pdfContructor.generarPdfReportes({
      desde: this.desde,
      hasta: this.hasta,
      top: this.top,
      financiero: this.financiero,
      minimos: this.minimos,
      topMedicamentos: this.topMedicamentos,
      atencion: this.atencion,
      nombreEmpresa: this.empresa.nombre
    }, 'open'); 
  }

  cargarTodo(): void {
    if (!this.desde || !this.hasta) {
      Swal.fire({ title: 'Validación', text: 'Selecciona desde y hasta.', icon: 'warning' });
      return;
    }

    this.loading = true;

    // 1) financieros
    this.servicio.financieros(this.desde, this.hasta).subscribe({
      next: (r) => (this.financiero = r),
      error: (err) => this.toastErr(err, 'No se pudo cargar reporte financiero')
    });

    // 2) inventario mínimos 
    this.servicio.inventarioMinimos().subscribe({
      next: (r) => (this.minimos = r || []),
      error: (err) => this.toastErr(err, 'No se pudo cargar inventario mínimos')
    });

    // 3) top medicamentos
    this.servicio.topMedicamentos(this.desde, this.hasta, this.top).subscribe({
      next: (r) => (this.topMedicamentos = r || []),
      error: (err) => this.toastErr(err, 'No se pudo cargar top medicamentos')
    });

    // 4) atención por empleado
    this.servicio.atencionPorEmpleado(this.desde, this.hasta).subscribe({
      next: (r) => (this.atencion = r || []),
      error: (err) => this.toastErr(err, 'No se pudo cargar reporte clínico')
    });

    // 5) RRHH 
    this.servicio.costoNomina(this.desde, this.hasta).subscribe({
      next: (r) => (this.costoNominaRRHH = r),
      error: (err) => this.toastErr(err, 'No se pudo cargar costo nómina')
    });

    setTimeout(() => (this.loading = false), 500);
  }

  private toastErr(err: any, fallback: string): void {
    const msg = err?.error?.message || err?.error || fallback;
    Swal.fire({ title: 'Error', text: String(msg), icon: 'error' });
    this.loading = false;
  }

  private lastDayOfMonthISO(year: number, month: number): string {
    const d = new Date(year, month, 0);
    const mm = String(month).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }

  formatQ(v: number | null | undefined): string {
    const n = Number(v ?? 0);
    return `Q ${n.toFixed(2)}`;
  }

  esBajo(m: MedicamentoMinimo): boolean {
    return (m.stock ?? 0) <= (m.minimo ?? 0);
  }
}
