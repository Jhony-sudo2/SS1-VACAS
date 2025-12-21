import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { EmpleadoService } from '../../services/Empleado/empleado.service';
import { AsignacionHorario } from '../../interfaces/Horario';
import { ActivatedRoute } from '@angular/router';
import { Empleado } from '../../interfaces/Usuario';

@Component({
  selector: 'app-asignar-horario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './asignar-horario.component.html',
})
export class AsignarHorarioComponent implements OnInit {
  empleadoId: Empleado = { id: 0 } as Empleado;

  diasSemana = [
    { label: 'Lunes', dia: 1 },
    { label: 'Martes', dia: 2 },
    { label: 'Miércoles', dia: 3 },
    { label: 'Jueves', dia: 4 },
    { label: 'Viernes', dia: 5 },
    { label: 'Sábado', dia: 6 },
    { label: 'Domingo', dia: 7 },
  ];

  form!: FormGroup;

  constructor(private fb: FormBuilder, private empleadoService: EmpleadoService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      dias: this.fb.array<FormGroup>([])
    });

  }

  ngOnInit(): void {
    this.diasFA.clear();
    this.diasSemana.forEach((d) => this.diasFA.push(this.createDiaGroup(d.dia)));
    const id = Number(this.route.snapshot.paramMap.get('empleadoId'));
    this.empleadoService.getEmpleadoById(id).subscribe({
      next: (response) => {
        this.empleadoId = response
        this.cargarHorarios()
      },
      error: (err) => {
        console.log(err);
        Swal.fire({ title: 'error', text: err.error, icon: 'error' })
      }
    })
  }

  get diasFA(): FormArray<FormGroup> {
    return this.form.get('dias') as FormArray<FormGroup>;
  }

  descansosFA(i: number): FormArray<FormGroup> {
    return this.diasFA.at(i).get('descansos') as FormArray<FormGroup>;
  }

  private cargarHorarios(): void {
    if (!this.empleadoId) return;
    if (this.empleadoId.id)
      this.empleadoService.getHorarioByEmpleadoId(this.empleadoId.id).subscribe({
        next: (data) => this.aplicarHorarios(data || []),
        error: (err) => {
          console.log(err);
          Swal.fire({ title: 'error', text: err.error, icon: 'error' })
        }
      });
  }

  private aplicarHorarios(asignaciones: AsignacionHorario[]): void {
    const porDia = new Map<number, AsignacionHorario>();
    asignaciones.forEach(a => porDia.set(Number(a.horario?.dia), a));

    for (let i = 0; i < this.diasFA.length; i++) {
      const diaCtrl = this.diasFA.at(i);
      const dia = Number(diaCtrl.get('dia')!.value);

      const asign = porDia.get(dia);

      if (!asign) {
        diaCtrl.get('trabaja')!.setValue(false); 
        continue;
      }

      diaCtrl.get('trabaja')!.setValue(true);

      diaCtrl.get('entrada')!.setValue(this.toHHmm((asign.horario as any)?.horaEntrada), { emitEvent: false });
      diaCtrl.get('salida')!.setValue(this.toHHmm((asign.horario as any)?.horaSalida), { emitEvent: false });

      const fa = diaCtrl.get('descansos') as FormArray;
      while (fa.length) fa.removeAt(0);

      (asign.descansos || []).forEach((d: any) => {
        fa.push(this.fb.group(
          {
            inicio: [this.toHHmm(d?.inicio ?? d?.horaInicio), Validators.required],
            fin: [this.toHHmm(d?.fin ?? d?.horaFin), Validators.required],
          },
          { validators: [timeOrderValidator('inicio', 'fin')] }
        ));
      });
    }
  }

  private createDiaGroup(dia: number): FormGroup {
    const g = this.fb.group(
      {
        dia: [dia, Validators.required],
        trabaja: [false],
        entrada: [{ value: '', disabled: true }, Validators.required], 
        salida: [{ value: '', disabled: true }, Validators.required],  
        descansos: this.fb.array<FormGroup>([]),
      },
      { validators: [timeOrderValidator('entrada', 'salida')] }
    );

    g.get('trabaja')!.valueChanges.subscribe((v: boolean | null) => {
      const entrada = g.get('entrada')!;
      const salida = g.get('salida')!;
      const descansos = g.get('descansos') as FormArray;

      if (v) {
        entrada.enable({ emitEvent: false });
        salida.enable({ emitEvent: false });
      } else {
        entrada.reset('', { emitEvent: false });
        salida.reset('', { emitEvent: false });
        entrada.disable({ emitEvent: false });
        salida.disable({ emitEvent: false });
        while (descansos.length) descansos.removeAt(0);
      }
    });

    return g;
  }

  addDescanso(i: number): void {
    const dia = this.diasFA.at(i);
    if (!dia.get('trabaja')!.value) return;

    this.descansosFA(i).push(
      this.fb.group(
        {
          inicio: ['', Validators.required], 
          fin: ['', Validators.required],    
        },
        { validators: [timeOrderValidator('inicio', 'fin')] }
      )
    );
  }

  removeDescanso(i: number, j: number): void {
    this.descansosFA(i).removeAt(j);
  }

  guardar(): void {
    this.form.markAllAsTouched();

    if (!this.empleadoId) {
      Swal.fire('Falta empleado', 'No se recibió empleadoId.', 'warning');
      return;
    }

    const diasInvalidos = this.diasFA.controls.some((ctrl) => {
      const trabaja = ctrl.get('trabaja')!.value === true;
      return trabaja && ctrl.invalid;
    });

    if (diasInvalidos) {
      Swal.fire('Campos incompletos', 'Revisa horas/descansos en los días trabajados.', 'warning');
      return;
    }

    const payload: any[] = this.diasFA.controls
      .filter((ctrl) => ctrl.get('trabaja')!.value === true)
      .map((ctrl) => {
        const dia = Number(ctrl.get('dia')!.value);
        const horaEntrada = String(ctrl.get('entrada')!.value); 
        const horaSalida = String(ctrl.get('salida')!.value);   

        const horario = {
          id: undefined,
          dia,
          horaEntrada,
          horaSalida,
          empleado: this.empleadoId,
        };

        const descansos = (ctrl.get('descansos') as FormArray).controls.map((d) => ({
          id: undefined,
          inicio: String(d.get('inicio')!.value),
          fin: String(d.get('fin')!.value),
        }));

        return {
          empleadoId: this.empleadoId.id,
          horario,
          descansos,
        };
      });
    this.empleadoService.asignarHorario(payload as AsignacionHorario[]).subscribe({
      next: () => Swal.fire('Listo', 'Horario asignado correctamente.', 'success'),
      error: (err) =>
        Swal.fire('Error', err?.error?.message || 'No se pudo asignar el horario.', 'error'),
    });
  }
  private toHHmm(v: any): string {
    if (!v) return '';
    if (typeof v === 'string' && /^\d{2}:\d{2}$/.test(v)) return v;
    if (typeof v === 'string' && /^\d{2}:\d{2}:\d{2}/.test(v)) return v.substring(0, 5);
    
    if (typeof v === 'string' && v.includes('T')) return v.substring(11, 16);

    return String(v).substring(0, 5);
  }
}

function timeOrderValidator(startKey: string, endKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const s = group.get(startKey)?.value;
    const e = group.get(endKey)?.value;
    if (!s || !e) return null;
    return String(s) < String(e) ? null : { timeOrder: true };
  };


}
