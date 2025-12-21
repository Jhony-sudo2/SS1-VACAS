import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarHorarioComponent } from './asignar-horario.component';

describe('AsignarHorarioComponent', () => {
  let component: AsignarHorarioComponent;
  let fixture: ComponentFixture<AsignarHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarHorarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
