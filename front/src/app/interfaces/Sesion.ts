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
    estadoPago:boolean,
    fecha:string
}

export interface pruebas{
    id:number|undefined,
    sesion:Sesion,
    fecha:string,
    resultado:number,
    interpretacion:string
}

export interface ImpresionDiagnostica{
    id:number|undefined,
    sesion:Sesion,
    descripcion:string,
    factoresPredisponentes:string,
    factoresPrecipitantes:string,
    factoresMantenedores:string,
    nivelFuncionamiento:string
}

export interface SesionDetail{
    sesion:Sesion,
    pruebasAplicadas:pruebas[],
    impresionDiagnostica:ImpresionDiagnostica
}
