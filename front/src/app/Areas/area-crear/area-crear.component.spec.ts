import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaCrearComponent } from './area-crear.component';

describe('AreaCrearComponent', () => {
  let component: AreaCrearComponent;
  let fixture: ComponentFixture<AreaCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
