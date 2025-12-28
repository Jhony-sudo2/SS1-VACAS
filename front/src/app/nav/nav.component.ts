import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Rol } from '../interfaces/Usuario';
import { AuthService } from '../services/Auth/auth.service';
interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string | any[];
  items?: MenuItem[];
}
@Component({
  selector: 'app-nav',
  imports: [RouterOutlet,RouterLink,RouterLinkActive,CommonModule,FormsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  rol:Rol|null = null
  sidebarOpen = false;


  constructor(private servicio:AuthService,private router:Router){}
  ngOnInit(){
    const usuario = this.servicio.getCurrentUser()
    if(usuario)
      this.rol = usuario.rol
  }
  logout() {
    this.servicio.logout();           
    this.router.navigate(['/auth']); 
    this.ngOnInit()
  }

}
