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
  constructor(private http: HttpClient) { }

  createEmpleado(usuario: Usuario, empleado: Empleado) {
    const data = { usuario, empleado }
    console.log(data);
    return this.http.post(this.url, data)
  }

  createPaciente(usuario: Usuario, paciente: Paciente) {
    const data = { usuario, paciente }
    return this.http.post(this.url, data)
  }

  confirmarCorreo(codigo: string) {
    const data = { codigo }
    return this.http.post(this.url + '/confirmarCorreo', data)
  }

  desactivar(id: number) {
    const data = { id }
    return this.http.put(this.url + '/actualizarEstado', data)
  }

  getAllPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.url + '/paciente')
  }

  getAllEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.url + '/empleado')
  }

  updatePassword(usuarioId: number, actual: string, nueva: string) {
    const data = { usuarioId, actual, nueva }
    return this.http.put(this.url + '/password', data)
  }

  recupearContrasenia(email: string) {
    const data = { email }
    return this.http.post(this.url + '/recuperarcontrasenia', data)
  }


  confirmarCodigo(email: string, codigo: string) {
    return this.http.post(this.url + '/confirmarcodigo', { email, codigo }, { responseType: 'text' });
  }
  cambiarContrasenia(email: string, nueva: string) {
    const data = { email, nueva }
    return this.http.put(this.url + '/password/cambiar', data)
  }


  getPaciente(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(this.url + '/paciente/id', { params: { id } })
  }

  getEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(this.url + '/empleado/id', { params: { id } })
  }

  updateEmpleado(empleado: Empleado) {
    console.log(empleado);
    return this.http.put(this.url + '/empleado', empleado)
  }

  updatePaciente(paciente: Paciente) {
    return this.http.put(this.url + '/paciente', paciente)
  }

}
