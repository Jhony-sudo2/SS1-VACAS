import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Antecedentes, EstadoInicial, Historia, HistoriaCreate, HistoriaDetail, HistoriaPersonal } from '../../interfaces/Historia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {
  baseUrl = environment.baseUrlEnv +'/historia'
  constructor(private http:HttpClient) { }

  saveHistoria(historiaCreate:HistoriaCreate,personal:HistoriaPersonal,antecedente:Antecedentes,estadoInicial:EstadoInicial){
   const data = {historiaCreate,personal,antecedente,estadoInicial}
   return this.http.post(this.baseUrl,data)
  }

  getHistoriasEmpleado(id:number):Observable<Historia[]>{
    return this.http.get<Historia[]>(this.baseUrl+'/empleado',{params:{id}})
  }

  getHistoriasPaciente(id:number):Observable<Historia[]>{
    return this.http.get<Historia[]>(this.baseUrl+'/paciente',{params:{id}})
  }

  getDetailsHistoria(id:number):Observable<HistoriaDetail>{
    return this.http.get<HistoriaDetail>(this.baseUrl+'/details',{params:{id}})
  }


}
