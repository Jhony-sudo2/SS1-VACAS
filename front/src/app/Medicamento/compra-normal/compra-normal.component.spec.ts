import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraNormalComponent } from './compra-normal.component';

describe('CompraNormalComponent', () => {
  let component: CompraNormalComponent;
  let fixture: ComponentFixture<CompraNormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraNormalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
