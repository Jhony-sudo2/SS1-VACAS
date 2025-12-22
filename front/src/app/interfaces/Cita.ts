import { Empleado, Paciente } from "./Usuario"

export enum Estado{
    AGENDADA="AGENDADA",
    CANCELADA="CANCELADA",
    PAGADA="PAGADA",
    COMPLETADA="COMPLETADA"
}
export interface Disponibilidad{
    empleadoId:number,
    nombreEmpleado:string,
    horariosDisponibles:string[]
}

export interface Cita{
    id:number,
    empleado:Empleado,
    paciente:Paciente,
    fecha:string,
    estado:Estado
}
