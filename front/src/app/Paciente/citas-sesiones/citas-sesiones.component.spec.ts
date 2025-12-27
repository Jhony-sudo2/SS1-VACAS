import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasSesionesComponent } from './citas-sesiones.component';

describe('CitasSesionesComponent', () => {
  let component: CitasSesionesComponent;
  let fixture: ComponentFixture<CitasSesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasSesionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
