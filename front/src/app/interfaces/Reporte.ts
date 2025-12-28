export interface ReporteFinancieroDTO {
  ingresosVentas: number;
  ingresosSesiones: number;
  ingresosTotales: number;
  costoNominaEstimado: number;
  gananciaEstimada: number;
}

export interface MedicamentoMinimo {
  id: number;
  nombre: string;
  stock: number;
  minimo: number;
  precio: number;
  tipo: boolean;
  imagen?: string;
}

export interface TopMedicamentoDTO {
  medicamentoId: number;
  nombre: string;
  cantidad: number;
}

export interface AtencionEmpleadoDTO {
  empleadoId: number;
  empleadoNombre: string;
  sesionesPagadas: number;
  totalRecaudado: number;
}
