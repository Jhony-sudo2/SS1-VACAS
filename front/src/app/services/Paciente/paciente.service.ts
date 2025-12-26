import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  baseUrl = environment.baseUrlEnv + '/paciente'
  constructor(private http:HttpClient) { }

  getReceta(id:number){
    
  }


}
