import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Antecedentes, EstadoInicial, Historia, HistoriaCreate, HistoriaDetail, HistoriaPersonal } from '../../interfaces/Historia';
import { Observable } from 'rxjs';
import { ImpresionDiagnostica, pruebas, Sesion, SesionDetail } from '../../interfaces/Sesion';
import { Receta, Tarea } from '../../interfaces/Receta';

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

  getById(id:number):Observable<Historia>{
    return this.http.get<Historia>(this.baseUrl+'/id',{params:{id}})
  }

  getHorarios(id:number,fecha:string,duracion:number):Observable<string[]>{
    return this.http.get<string[]>(this.baseUrl+'/horarios',{params:{id,fecha,duracion}})
  }

  getSesionesHistoria(id:number):Observable<Sesion[]>{
    return this.http.get<Sesion[]>(this.baseUrl+'/sesionHistoria',{params:{id}})
  }


  guardarSesion(sesion:Sesion){
    return this.http.post(this.baseUrl+'/sesion',sesion)
  }

  guardarPrueba(prueba:pruebas){
      return this.http.post(this.baseUrl+'/prueba',prueba)
  }
  
  guardarImpresion(impresion:ImpresionDiagnostica){
    return this.http.post(this.baseUrl+'/impresion',impresion)
  }

  getDetails(id:number):Observable<SesionDetail>{
    return this.http.get<SesionDetail>(this.baseUrl+'/sesion/details',{params:{id}})
  }
  
  guardarTarea(tarea:Tarea){
    return this.http.post(this.baseUrl+'/tarea',tarea)
  }

  guardarReceta(recetas:Receta[]){
    return this.http.post(this.baseUrl+'/receta',recetas)
  }

  darAlta(id:number,motivo:string){
    const data = {id,motivo}
    return this.http.post(this.baseUrl+'/darAlta',data)
  }

  getTareas(id:number):Observable<Tarea[]>{
    return this.http.get<Tarea[]>(this.baseUrl+'/tarea',{params:{id}})
  }

  getReceta(id:number):Observable<Receta[]>{
    return this.http.get<Receta[]>(this.baseUrl+'/receta',{params:{id}})
  }

  completarTarea(id:number){
    const data = {id}
    return this.http.post(this.baseUrl+'/tarea/completar',data)
  }


}
