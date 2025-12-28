import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { AtencionEmpleadoDTO, MedicamentoMinimo, ReporteFinancieroDTO, TopMedicamentoDTO } from '../../interfaces/Reporte';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  baseUrl = environment.baseUrlEnv + '/reportes';

  constructor(private http: HttpClient) { }

  financieros(desde: string, hasta: string): Observable<ReporteFinancieroDTO> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<ReporteFinancieroDTO>(`${this.baseUrl}/financieros`, { params });
  }

  inventarioMinimos(): Observable<MedicamentoMinimo[]> {
    return this.http.get<MedicamentoMinimo[]>(`${this.baseUrl}/inventario/minimos`);
  }

  topMedicamentos(desde: string, hasta: string, top = 10): Observable<TopMedicamentoDTO[]> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta)
      .set('top', String(top));
    return this.http.get<TopMedicamentoDTO[]>(`${this.baseUrl}/inventario/top-medicamentos`, { params });
  }

  atencionPorEmpleado(desde: string, hasta: string): Observable<AtencionEmpleadoDTO[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<AtencionEmpleadoDTO[]>(`${this.baseUrl}/clinicos/atencion-por-empleado`, { params });
  }

  costoNomina(desde: string, hasta: string): Observable<number> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<number>(`${this.baseUrl}/rrhh/costo-nomina`, { params });
  }
}