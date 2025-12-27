import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecupearContraseniaComponent } from './recupear-contrasenia.component';

describe('RecupearContraseniaComponent', () => {
  let component: RecupearContraseniaComponent;
  let fixture: ComponentFixture<RecupearContraseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecupearContraseniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecupearContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
