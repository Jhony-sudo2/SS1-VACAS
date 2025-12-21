import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Area, AsignacionServicio, Servicio } from '../../interfaces/Area';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.baseUrlEnv +'/admin'
  constructor(private http:HttpClient) { }

  saveArea(data:Area){
    return this.http.post(this.baseUrl+'/area',data)
  }

  saveServicio(data:Servicio){
    return this.http.post(this.baseUrl+'/servicio',data)
  }

  asignarServicio(data:AsignacionServicio){
    return this.http.post(this.baseUrl+'/servicios/asignar',data)
  }

}
