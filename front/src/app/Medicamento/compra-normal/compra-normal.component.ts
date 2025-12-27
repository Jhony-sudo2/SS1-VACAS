import { Component } from '@angular/core';
import { CompraService } from '../../services/Pago/compra.service';
import { AuthService } from '../../services/Auth/auth.service';
import { Medicamento } from '../../interfaces/Medicamento';
import { MedicamentoService } from '../../services/Medicamento/medicamento.service';
import Swal from 'sweetalert2';
import { Paciente, Rol } from '../../interfaces/Usuario';
import { UserService } from '../../services/User/user.service';
import { Compra, Detalle } from '../../interfaces/Pago';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ItemCarrito = { med: Medicamento; cantidad: number };

@Component({
  selector: 'app-compra-normal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compra-normal.component.html',
  styleUrl: './compra-normal.component.css'
})
export class CompraNormalComponent {
  medicamentos: Medicamento[] = [];
  pacientes: Paciente[] = [];

  // rol / usuario
  esPaciente = false;
  idUsuarioActual = 0;

  // si NO es paciente: paciente opcional
  pacienteIdSeleccionado: number | null = null;

  // pago
  metodoPago: 'TARJETA' | 'EFECTIVO' = 'TARJETA';
  tarjeta = '';
  codigo = '';
  fechaVencimiento = '';

  // carrito
  carrito: ItemCarrito[] = [];

  // ui
  cargando = false;
  comprando = false;
  q = ''; // búsqueda opcional

  constructor(
    private servicio: CompraService,
    private authService: AuthService,
    private medicamentoService: MedicamentoService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const usuario = this.authService.getCurrentUser();
    if (usuario?.id) {
      this.idUsuarioActual = usuario.id;
      this.esPaciente = usuario.rol === Rol.PACIENTE;
      // Paciente compra para sí
      if (this.esPaciente) this.pacienteIdSeleccionado = usuario.id;
    }

    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando = true;

    this.medicamentoService.findAll().subscribe({
      next: (resp) => (this.medicamentos = resp ?? []),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar medicamentos', icon: 'error' })
    });

    // Solo lo ocupan empleados/otros para escoger paciente,
    // pero cargarlo no hace daño (si querés, lo condicionamos).
    this.userService.getAllPacientes().subscribe({
      next: (resp) => (this.pacientes = resp ?? []),
      error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudieron cargar pacientes', icon: 'error' }),
      complete: () => (this.cargando = false)
    });
  }

  // ====== carrito ======
  cantidadDe(m: Medicamento): number {
    const id = m?.id;
    if (!id) return 0;
    return this.carrito.find((x) => x.med.id === id)?.cantidad ?? 0;
  }

  add(m: Medicamento): void {
    if (!m?.id) return;

    const actual = this.cantidadDe(m);
    if (m.stock != null && actual + 1 > m.stock) {
      Swal.fire({ title: 'Stock', text: 'No hay suficiente stock.', icon: 'warning' });
      return;
    }

    if (actual === 0) {
      this.carrito = [...this.carrito, { med: m, cantidad: 1 }];
    } else {
      this.carrito = this.carrito.map((x) =>
        x.med.id === m.id ? { ...x, cantidad: x.cantidad + 1 } : x
      );
    }
  }

  remove(m: Medicamento): void {
    if (!m?.id) return;
    const actual = this.cantidadDe(m);
    if (actual <= 0) return;

    if (actual === 1) {
      this.carrito = this.carrito.filter((x) => x.med.id !== m.id);
    } else {
      this.carrito = this.carrito.map((x) =>
        x.med.id === m.id ? { ...x, cantidad: x.cantidad - 1 } : x
      );
    }
  }

  clear(): void {
    this.carrito = [];
  }

  get total(): number {
    return this.carrito.reduce((acc, it) => acc + Number(it.med.precio ?? 0) * Number(it.cantidad ?? 0), 0);
  }

  // ====== comprar ======
  comprar(): void {
    if (this.carrito.length === 0) {
      Swal.fire({ title: 'Validación', text: 'Selecciona al menos un medicamento.', icon: 'warning' });
      return;
    }

    // pacienteId:
    // - paciente: forzado a su id
    // - empleado: opcional (puede ser null)
    let pacienteId: number | null = null;

    if (this.esPaciente) {
      pacienteId = this.idUsuarioActual || null;
      if (!pacienteId) {
        Swal.fire({ title: 'Error', text: 'No se pudo identificar el paciente.', icon: 'error' });
        return;
      }
    } else {
      pacienteId = this.pacienteIdSeleccionado; // puede ser null
    }

    // pago:
    const esTarjeta = this.esPaciente || this.metodoPago === 'TARJETA';

    let tarjeta = '';
    let codigo = '';
    let fechaV = '';

    if (esTarjeta) {
      tarjeta = (this.tarjeta || '').trim();
      codigo = (this.codigo || '').trim();
      fechaV = (this.fechaVencimiento || '').trim();

      if (!tarjeta || tarjeta.length < 8) {
        Swal.fire({ title: 'Validación', text: 'Ingresa un número de tarjeta válido.', icon: 'warning' });
        return;
      }
      if (!codigo || codigo.length < 3) {
        Swal.fire({ title: 'Validación', text: 'Ingresa un código válido.', icon: 'warning' });
        return;
      }
      if (!fechaV) {
        Swal.fire({ title: 'Validación', text: 'Ingresa la fecha de vencimiento.', icon: 'warning' });
        return;
      }
    }

    const detalle: Detalle[] = this.carrito
      .filter((x) => x.med?.id && x.cantidad > 0)
      .map((x) => ({
        medicamentoId: Number(x.med.id),
        cantidad: Number(x.cantidad)
      }));

    const payload: Compra = {
      detalle,
      pacienteId: (pacienteId as any), 
      tipo: esTarjeta,                 
      tarjeta,
      codigo,
      fechaVencimiento: fechaV
    };

    Swal.fire({
      title: 'Confirmar',
      text: `Total: Q ${this.total}. ¿Deseas continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, comprar',
      cancelButtonText: 'Cancelar'
    }).then((r) => {
      if (!r.isConfirmed) return;

      this.comprando = true;
      this.servicio.comprar(payload).subscribe({
        next: () => {
          Swal.fire({ title: 'OK', text: 'Compra realizada.', icon: 'success' });
          this.clear();
          this.tarjeta = '';
          this.codigo = '';
          this.fechaVencimiento = '';
          if (!this.esPaciente) this.pacienteIdSeleccionado = null;
        },
        error: (err) => Swal.fire({ title: 'Error', text: err?.error || 'No se pudo realizar la compra', icon: 'error' }),
        complete: () => (this.comprando = false)
      });
    });
  }

  // filtro opcional
  get medicamentosFiltrados(): Medicamento[] {
    const term = (this.q || '').trim().toLowerCase();
    if (!term) return this.medicamentos;
    return this.medicamentos.filter((m) => (m?.nombre || '').toLowerCase().includes(term));
  }

  trackByMedId = (_: number, m: Medicamento) => m.id;
}