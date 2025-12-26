import { Routes } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { CreatePacienteComponent } from './User/create-paciente/create-paciente.component';
import { CreateUserComponent } from './User/create-user/create-user.component';
import { AsignarHorarioComponent } from './Empleado/asignar-horario/asignar-horario.component';
import { ListaComponent } from './Empleado/lista/lista.component';
import { AsignarAreaComponent } from './Empleado/asignar-area/asignar-area.component';
import { CrearComponent } from './Medicamento/crear/crear.component';
import { AgendarComponent } from './Cita/agendar/agendar.component';
import { AreaCrearComponent } from './Areas/area-crear/area-crear.component';
import { CrearPacienteComponent } from './Paciente/crear-paciente/crear-paciente.component';
import { MisCitasComponent } from './Cita/mis-citas/mis-citas.component';
import { CrearHistoriaComponent } from './Historia/crear-historia/crear-historia.component';
import { VerHistoriaComponent } from './Historia/ver-historia/ver-historia.component';
import { SesionComponent } from './Historia/sesion/sesion.component';
import { RecetaTareasComponent } from './Paciente/receta-tareas/receta-tareas.component';

export const routes: Routes = [
     {path:'auth',component:LoginComponent,title:'login'},
    {path:'',component:NavComponent,title:'Main',children:[
        {path:'paciente-create',component:CreatePacienteComponent,title:'Crear paciente'},
        {path:'usuario-create',component:CreateUserComponent,title:'Crear usuario'},
        {path:'asignar-horario/:empleadoId',component:AsignarHorarioComponent,title:'Asignar Horario'},
        {path:'lista-empleado',component:ListaComponent,title:'Lista empleados'},
        {path:'asignar-area/:empleadoId',component:AsignarAreaComponent,title:'Asignar Area'},
        {path:'medicamentos',component:CrearComponent,title:'medicamentos'},
        {path:'cita-agendar',component:AgendarComponent,title:'Agendar Cita'},
        {path:'area-crear',component:AreaCrearComponent,title:'Crear Area'},
        {path:'paciente-crear',component:CrearPacienteComponent,title:'Crear Paciente'},
        {path:'mis-citas',component:MisCitasComponent,title:'Mis citas'},
        {path:'historia-crear',component:CrearHistoriaComponent,title:'Crear Historia'},
        {path:'ver-historia',component:VerHistoriaComponent,title:'Ver historias'},
        {path:'sesion-gestion/:historia',component:SesionComponent,title:'Gestion Sesiones'},
        {path:'receta-tareas',component:RecetaTareasComponent,title:'Recetas y tareas'}
    ]},
];
