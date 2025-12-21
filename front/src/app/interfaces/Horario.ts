import { Empleado } from "./Usuario";

export interface Horario{
    id:number|undefined,
    dia:number,
    horaEntrada:string,
    horaSalida:string,
    empleado:Empleado
}

export interface Descanso{
    id:number|undefined,
    horario:Horario,
    inicio:string,
    fin:string
}

export interface AsignacionHorario{
    empleadoId:number,
    horario:Horario,
    descansos:Descanso[]
}