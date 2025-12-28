import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { Area, Servicio } from '../../interfaces/Area';
import { Dashboard, Empresa } from '../../interfaces/Empresa';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  baseUrl = environment.baseUrlEnv + '/general'
  baseUrl2 = environment.baseUrlEnv +'/empresa'
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

  getEmpresa():Observable<Empresa>{
    return this.http.get<Empresa>(this.baseUrl2)
  }

  updateEmpresa(empresa:Empresa){
    return this.http.put(this.baseUrl2,empresa)
  }

  getDashboard():Observable<Dashboard>{
    return this.http.get<Dashboard>(this.baseUrl2+'/dashboard')
  }

}
