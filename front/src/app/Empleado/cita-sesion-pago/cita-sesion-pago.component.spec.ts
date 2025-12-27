import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaSesionPagoComponent } from './cita-sesion-pago.component';

describe('CitaSesionPagoComponent', () => {
  let component: CitaSesionPagoComponent;
  let fixture: ComponentFixture<CitaSesionPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaSesionPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaSesionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
