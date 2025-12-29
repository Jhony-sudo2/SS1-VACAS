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
import { ComprasComponent } from './Paciente/compras/compras.component';
import { EntregarVentaComponent } from './Empleado/entregar-venta/entregar-venta.component';
import { CompraNormalComponent } from './Medicamento/compra-normal/compra-normal.component';
import { PerfilComponent } from './User/perfil/perfil.component';
import { RecupearContraseniaComponent } from './User/recupear-contrasenia/recupear-contrasenia.component';
import { CitasSesionesComponent } from './Paciente/citas-sesiones/citas-sesiones.component';
import { CitaSesionPagoComponent } from './Empleado/cita-sesion-pago/cita-sesion-pago.component';
import { MainComponent } from './Empleado/nomina/nomina.component';
import { ReportesComponent } from './Empleado/reportes/reportes.component';
import { EmpresaComponent } from './Empleado/empresa/empresa.component';
import { SueldoComponent } from './Empleado/sueldo/sueldo.component';

export const routes: Routes = [
    {path:'auth',component:LoginComponent,title:'login'},
    {path:'recuperar-contrasenia',component:RecupearContraseniaComponent,title:'Recuperar contrasenia'},
    {path:'paciente-create',component:CrearPacienteComponent,title:'Crear paciente'},
    {path:'',component:NavComponent,title:'Main',children:[
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        {path:'main',component:MainComponent,title:'MAIN'},
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
        {path:'receta-tareas',component:RecetaTareasComponent,title:'Recetas y tareas'},
        {path:'mis-gastos',component:ComprasComponent,title:'Mis compras'},
        {path:'entregar-venta',component:EntregarVentaComponent,title:'Entregar ventas'},
        {path:'comprar',component:CompraNormalComponent,title:'Compra'},
        {path:'mi-perfil',component:PerfilComponent,title:'My perfil'},
        {path:'sesiones-citas',component:CitasSesionesComponent,title:'Mis citas y sesiones'},
        {path:'pago-sesiones',component:CitaSesionPagoComponent,title:'Pago citas y sesiones'},
        {path:'reportes',component:ReportesComponent,title:'Reporte'},
        {path:'empresa',component:EmpresaComponent,title:'Empresa'},
        {path:'sueldo/:empleadoId',component:SueldoComponent,title:'Sueldo'}
    ]},
];
