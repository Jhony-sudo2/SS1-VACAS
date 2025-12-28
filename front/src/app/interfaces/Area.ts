export interface Area{
    id:number|undefined,
    nombre:String,
    descripcion:string,
    imagen:string
}

export interface AsignacionArea{
    idEmpleado:number,
    areas:number[]
}

export interface Servicio{
    id:number|undefined,
    nombre:String
    descripcion:string,
    imagen:string
}

export interface AsignacionServicio{
    areaId:number,
    servicios:number[],
    
}