import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclamationCircleComponent } from './exclamation-circle.component';

describe('ExclamationCircleComponent', () => {
  let component: ExclamationCircleComponent;
  let fixture: ComponentFixture<ExclamationCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExclamationCircleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExclamationCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
