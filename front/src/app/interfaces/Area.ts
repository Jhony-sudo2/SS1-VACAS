export interface Area{
    id:number|undefined,
    nombre:String
}

export interface AsignacionArea{
    idEmpleado:number,
    areas:number[]
}

export interface Servicio{
    id:number|undefined,
    nombre:String
}

export interface AsignacionServicio{
    areaId:number,
    servicios:number[]
}