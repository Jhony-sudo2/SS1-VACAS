export enum Rol{
ADMIN = "ADMIN",
PACIENTE = "PACIENTE",
TRABAJADOR = "TRABAJADOR",
ADMINISTRATIVO = "ADMINISTRATIVO",
MANTENIMIENTO = "MANTENIMIENTO"
}
export interface Usuario{
    id:number|undefined,
    email:string,
    password:string,
    rol:Rol,
    a2f:boolean,
    estado:boolean
}

export interface Paciente{
    id:number|undefined,
    nombre:string,
    fechaNacimiento:Date,
    genero:boolean,
    estadoCivil:boolean,
    direccion:string,
    nivelEducativo:string,
    telefono:string,
    personEmergencia:string,
    telefonoEmergencia:string,
    procedencia:String,
    usuario:Usuario
}

export interface Empleado{
    id:number|undefined,
    nombre:string,
    fechaNacimiento:Date,
    genero:boolean,
    estadoCivil:boolean,
    telefono:string,
    colegiado:string,
    sueldo:number,
    bono:number,
    aplicaIgss:boolean
    usuario:Usuario
}