import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatIbanDeComponent } from './mat-iban-de.component';

describe('MatIbanComponent', () => {
  let component: MatIbanDeComponent;
  let fixture: ComponentFixture<MatIbanDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatIbanDeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatIbanDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
