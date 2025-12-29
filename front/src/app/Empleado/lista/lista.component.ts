import { Component } from '@angular/core';
import { EmpleadoService } from '../../services/Empleado/empleado.service';
import { Empleado, Rol } from '../../interfaces/Usuario';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/User/user.service';

@Component({
  selector: 'app-lista',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {
  empleados:Empleado[] = []
  constructor(private servicio:EmpleadoService,private servicio2:UserService){}
  rol = Rol

  ngOnInit(){
    this.servicio.getAllEmpleados().subscribe({
      next:(response)=>{this.empleados = response},
      error:(err)=>{console.log(err)
        Swal.fire({title:'error',text:err.error,icon:'error'})}
    })
  }

  desactivar(idUsuario:number,estado:boolean){
    const mensaje = estado ? "desactivado" : "activado";
    this.servicio2.desactivar(idUsuario).subscribe({
      next:()=>{Swal.fire({title:'OK',text:'USUARIO ' + mensaje,icon:'success'}), this.ngOnInit()},
      error:(err)=>{Swal.fire({title:'ERROR',text:err.error,icon:'error'})}
    })
  }
}
