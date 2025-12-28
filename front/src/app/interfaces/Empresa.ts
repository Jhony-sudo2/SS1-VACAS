import { Area, Servicio } from "./Area"
import { Medicamento } from "./Medicamento"

export interface Empresa{
    id:number,
    nombre:string,
    precioCita:number,
    tiempoCita:number,
    imagen:string
}


export interface Dashboard{
    empresa:Empresa,
    areas:Area[],
    servicios:Servicio[],
    medicamentos:Medicamento[]
}