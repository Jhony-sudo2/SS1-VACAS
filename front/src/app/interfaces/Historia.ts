import { Sesion } from "./Sesion"
import { Empleado, Paciente } from "./Usuario"

export enum Modalidad{
    INDIVIDUAL,FAMILIAR,PAREJA,GRUPO
}
export enum Enfoque{
    COGNITIVO,SISTEMICO,PSICODINAMICO,HUMANISTA,INTEGRATIVO
}
export enum Frecuencia{
    SEMANAL,QUINCENAL,MENSUAL
}
export enum Consumo{
    NUNCA,OCASIONAL,MODERADO,EXCESIVO
}
export enum EstadoEmocion{
    MUYBAJO,BAJO,NORMAL,ALTO,MUYALTO
}
export enum EstadoHistoria{
    ACTIVO="ACTIVO",ALTA="ALTA"
}

export interface HistoriaCreate{
    empleadoId:number,
    pacienteId:number,
    fechaApertura:string,
    motivoConsulta:string,
    procedencia:string
    modalidad:Modalidad,
    sesiones:number,
    duracion:number,
    costoSesion:number,
    frecuencia:Frecuencia,
    enfoque:Enfoque
}

export interface HistoriaPersonal{
    id:number|undefined,
    desarrollo:string,
    historiaAcademica:string,
    historiaMedica:string,
    medicacionActual:string,
    alcohol:Consumo,
    tabaco:Consumo,
    drogas:Consumo,
    tratamientosPrevios:string,
    hospitalizaciones:string
    historia:Historia
}

export interface Antecedentes{
    id:number|undefined,
    estructura:string,
    trastornos:string,
    eventos:string
    paciente:Paciente
}

export interface EstadoInicial{
    id:number|undefined,
    animo:EstadoEmocion,
    ansiedad:EstadoEmocion,
    funcionamientosocial:EstadoEmocion,
    suenio:EstadoEmocion,
    apetito:EstadoEmocion,
    observaciones:string,
    historia:Historia
}

export interface Historia{
    id:number|undefined
    empleado:Empleado
    paciente:Paciente;
    fechaApertura:string;
    estado:EstadoHistoria;
    motivoConsulta:string,
    procedencia:string,
    motivoAlta:string
    modalidad:Modalidad,
    sesiones:number,
    duracion:number,
    costoSesion:number,
    frecuencia:Frecuencia,
    enfoque:Enfoque
}

export interface HistoriaDetail{
    historia:Historia,
    historiaPersonal:HistoriaPersonal,
    estadoInicial:EstadoInicial,
    antecedente:Antecedentes,
    sesiones:Sesion[]
}






