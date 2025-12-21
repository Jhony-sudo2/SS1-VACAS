import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { Area, Servicio } from '../../interfaces/Area';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  baseUrl = environment.baseUrlEnv + '/general'
  constructor(private http:HttpClient) { }

  getAllAreas():Observable<Area[]>{
    return this.http.get<Area[]>(this.baseUrl+'/areas')
  }

  getAllServicios():Observable<Servicio[]>{
    return this.http.get<Servicio[]>(this.baseUrl+'/servicios')
  }

  getAllServiciosArea(areaId:number):Observable<Servicio[]>{
    return this.http.get<Servicio[]>(this.baseUrl+'/area/servicios',{params:{areaId}})
  }

}
