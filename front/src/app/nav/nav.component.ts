import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string | any[];
  items?: MenuItem[];
}
@Component({
  selector: 'app-nav',
  imports: [RouterOutlet,RouterLink,RouterLinkActive,NgClass,CommonModule,FormsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
   sidebarOpen = false; // móvil: cerrado al inicio

  menu: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard'] },
    {
      label: 'Créditos',
      icon: 'pi pi-wallet',
      items: [
        { label: 'Listado', routerLink: ['/creditos'] },
        { label: 'Nuevo crédito', routerLink: ['/creditos/nuevo'] },
      ],
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      items: [
        { label: 'Listado', routerLink: ['/usuarios'] },
        { label: 'Crear usuario', routerLink: ['/usuarios/nuevo'] },
      ],
    },
    { label: 'Configuración', icon: 'pi pi-cog', routerLink: ['/configuracion'] },
  ];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
