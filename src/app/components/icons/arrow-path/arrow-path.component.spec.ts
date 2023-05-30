import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowPathComponent } from './arrow-path.component';

describe('ArrowPathComponent', () => {
  let component: ArrowPathComponent;
  let fixture: ComponentFixture<ArrowPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowPathComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
