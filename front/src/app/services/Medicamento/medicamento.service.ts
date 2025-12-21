import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Medicamento } from '../../interfaces/Medicamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  baseUrl = environment.baseUrlEnv +'/medicamento'
  constructor(private http:HttpClient) { }

  saveMedicamento(data:Medicamento){
    return this.http.post(this.baseUrl,data)
  }

  findAll():Observable<Medicamento[]>{
    return this.http.get<Medicamento[]>(this.baseUrl)
  }

  findById(id:number){
    return this.http.get<Medicamento>(this.baseUrl+'/id',{params:{id}})
  }

  updateStock(id:number,cantidad:number){
    const data = {id,cantidad}
    return this.http.put(this.baseUrl+'/stock',data)
  }

}
