import { Estado } from "./Cita";
import { Historia } from "./Historia";

export interface Sesion{
    id:number|undefined,
    historia:Historia,
    numero:number,
    estado:Estado,
    justificacion:string,
    temas:string,
    respuestas:string,
    observaciones:string,
    estadoPago:boolean
}