import { Medicamento } from "./Medicamento";
import { Paciente } from "./Usuario";

export interface Receta{
    id:number|undefined,
    medicamento:Medicamento,
    paciente:Paciente,
    indicaciones:string,
    cantidad:number
    sesion:number
}

export interface Tarea{
    id:number|undefined,
    paciente:Paciente,
    instrucciones:string,
    estado:boolean
}

