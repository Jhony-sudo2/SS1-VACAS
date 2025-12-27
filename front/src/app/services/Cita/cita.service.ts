import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { Cita, Disponibilidad, Estado } from '../../interfaces/Cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  baseUrl = environment.baseUrlEnv + '/cita'
  constructor(private http:HttpClient) { }

  getHorariosDisponibles(idServicio:number,fecha:string):Observable<Disponibilidad[]>{
    return this.http.get<Disponibilidad[]>(this.baseUrl+'/disponibilidad',{params:{idServicio,fecha}})
  }

  agendar(pacienteId:number,empleadoId:number,fecha:string,servicioId:number){
    const data = {pacienteId,empleadoId,fecha,servicioId}
    console.log(fecha);
    return this.http.post(this.baseUrl+'/agendar',data)
  }

  myCitas(id:number):Observable<Cita[]>{
    return this.http.get<Cita[]>(this.baseUrl+'/empleado',{params:{id}})
  }

  myCitasPaciente(id:number):Observable<Cita[]>{
    return this.http.get<Cita[]>(this.baseUrl+'/paciente',{params:{id}})
  }

  updateState(id:number,estado:Estado){
    const data = {id,estado}
    return this.http.post(this.baseUrl+'/update',data)
  }

  getAllCitas():Observable<Cita[]>{
    return this.http.get<Cita[]>(this.baseUrl)
  }

  getCitaById(id:number):Observable<Cita>{
    return this.http.get<Cita>(this.baseUrl+'/id',{params:{id}})
  }
  

}
