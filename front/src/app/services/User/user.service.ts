import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empleado, Paciente, Usuario } from '../../interfaces/Usuario';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.baseUrlEnv + '/user';
  constructor(private http:HttpClient) { }

  createEmpleado(usuario:Usuario,empleado:Empleado){
    const data = {usuario,empleado}
    return this.http.post(this.url,data)
  }

  createPaciente(usuario:Usuario,paciente:Paciente){
    const data = {usuario,paciente}
    return this.http.post(this.url,data)
  }

  confirmarCorreo(codigo:string){
    const data ={codigo} 
    return this.http.post(this.url+'/confirmarCorreo',data)
  }

  desactivar(id:number){
    const data = {id}
    return this.http.put(this.url+'/actualizarEstado',data)
  }

  getAllPacientes():Observable<Paciente[]>{
    return this.http.get<Paciente[]>(this.url+'/paciente')
  }
  
}
