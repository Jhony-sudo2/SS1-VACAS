import { Injectable, numberAttribute } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra, Detalle, PagoSesion, ResponseReceta, Venta } from '../../interfaces/Pago';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  baseUrr = environment.baseUrlEnv +'/compra'
  constructor(private http:HttpClient) { }
  
  getMedicamentosxRecetaSesionId(id:number):Observable<ResponseReceta[]>{
    return this.http.get<ResponseReceta[]>(this.baseUrr+'/receta',{params:{id}})
  }

  comprar(data:Compra){
    console.log(data);
    return this.http.post(this.baseUrr+'/normal',data)
  }

  findVentasByPacienteId(id:number):Observable<Venta[]>{
    return this.http.get<Venta[]>(this.baseUrr+'/venta',{params:{id}})
  }

  findPagoSesionByPacienteId(id:number):Observable<PagoSesion[]>{
    return this.http.get<PagoSesion[]>(this.baseUrr+'/sesion',{params:{id}})
  }

  pagarSesion(pago:PagoSesion){
    return this.http.post(this.baseUrr+'/sesion',pago)
  }

  getAllVentas():Observable<Venta[]>{
    return this.http.get<Venta[]>(this.baseUrr+'/ventas')
  }

  getDetallesVenta(id:number):Observable<ResponseReceta[]>{
    return this.http.get<ResponseReceta[]>(this.baseUrr+'/venta/detalle',{params:{id}})
  }

  entregarVenta(id:number){
    const data = {id}
    return this.http.post(this.baseUrr+'/entregar',data)
  }
   findById(id:number):Observable<Venta>{
    return this.http.get<Venta>(this.baseUrr+'/venta/id',{params:{id}})
  }


}
