import { Cita } from "./Cita";
import { Medicamento } from "./Medicamento";
import { Sesion } from "./Sesion";
import { Paciente } from "./Usuario";

export interface ResponseReceta{
    medicamento:Medicamento,
    cantidad:number
}

export interface PagoSesion{
    id:number|undefined,
    sesion:Sesion|undefined,
    cita:Cita|undefined,
    tarjeta:string,
    codigo:string,
    fechaVencimiento:string,
    total:number
}

export interface Venta{
    id:number,
    paciente:Paciente,
    total:number,
    fecha:string,
    estadoEntrega:boolean,
    tarjeta:string,
    codigo:string,
    fechaVencimiento:string
}

export interface Compra{
    detalle:Detalle[]
    pacienteId:number,
    tipo:boolean,
    tarjeta:string,
    codigo:string,
    fechaVencimiento:string
}

export interface Detalle{
    medicamentoId:number,
    cantidad:number
}