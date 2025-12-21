import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { AsignacionHorario } from '../../interfaces/Horario';
import { Observable } from 'rxjs';
import { Empleado } from '../../interfaces/Usuario';
import { Area, AsignacionArea } from '../../interfaces/Area';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  baseUrl = environment.baseUrlEnv +'/empleado'
  constructor(private http:HttpClient) { }

  asignarHorario(data:AsignacionHorario[]){
    console.log(data);
    return this.http.post(this.baseUrl+'/asignarHorario',data)
  }

  getEmpleadoById(id:number):Observable<Empleado>{
    return this.http.get<Empleado>(this.baseUrl+'/id',{params:{id}})
  }

  getHorarioByEmpleadoId(id:number):Observable<AsignacionHorario[]>{
    return this.http.get<AsignacionHorario[]>(this.baseUrl+'/horario',{params:{id}})
  }

  getAllEmpleados():Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.baseUrl)
  }

  asignarArea(idEmpleado:number,areas:number[]){
    const data = {idEmpleado,areas}
    return this.http.post(this.baseUrl+'/asignarArea',data)
  }

  getAreas(id:number):Observable<Area[]>{
    return this.http.get<Area[]>(this.baseUrl+'/areas',{params:{id}})
  }


}
