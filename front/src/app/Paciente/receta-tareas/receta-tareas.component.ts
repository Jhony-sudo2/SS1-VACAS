import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { HistoriaService } from '../../services/Historia/historia.service';
import { Receta, Tarea } from '../../interfaces/Receta';
import Swal from 'sweetalert2';
import { CompraService } from '../../services/Pago/compra.service';

@Component({
  selector: 'app-receta-tareas',
  imports: [],
  templateUrl: './receta-tareas.component.html',
  styleUrl: './receta-tareas.component.css'
})
export class RecetaTareasComponent {
  idUsuario:number = 0
  recetas:Receta[]=[]
  tareas:Tarea[]=[]
  constructor(private authService:AuthService,private servicio:HistoriaService,private pagoService:CompraService){}

  ngOnInit(){
    const usuario = this.authService.getCurrentUser()
    if(usuario?.id){
      this.servicio.getReceta(usuario.id).subscribe({
        next:(response)=>{this.recetas = response}
      })
      this.servicio.getTareas(usuario.id).subscribe({
        next:(response)=>{this.tareas = response}
      })
    }
  }

  completarTarea(id:number){
    this.servicio.completarTarea(id).subscribe({
      next:()=>{Swal.fire({title:'OK',text:'TAREA COMPLETADA',icon:'success'})},
      error:(err)=>{Swal.fire({title:'Error',text:err.error,icon:'error'})}
    })
  }



}
