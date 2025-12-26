import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  baseUrr = environment.baseUrlEnv +'/compra'
  constructor(private http:HttpClient) { }
  

}
