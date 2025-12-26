import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetaTareasComponent } from './receta-tareas.component';

describe('RecetaTareasComponent', () => {
  let component: RecetaTareasComponent;
  let fixture: ComponentFixture<RecetaTareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetaTareasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetaTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
