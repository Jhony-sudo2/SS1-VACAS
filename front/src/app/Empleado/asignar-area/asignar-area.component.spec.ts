import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarAreaComponent } from './asignar-area.component';

describe('AsignarAreaComponent', () => {
  let component: AsignarAreaComponent;
  let fixture: ComponentFixture<AsignarAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
