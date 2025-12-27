import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregarVentaComponent } from './entregar-venta.component';

describe('EntregarVentaComponent', () => {
  let component: EntregarVentaComponent;
  let fixture: ComponentFixture<EntregarVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregarVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregarVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
