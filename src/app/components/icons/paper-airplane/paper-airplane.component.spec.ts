import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperAirplaneComponent } from './paper-airplane.component';

describe('PaperAirplaneComponent', () => {
  let component: PaperAirplaneComponent;
  let fixture: ComponentFixture<PaperAirplaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperAirplaneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperAirplaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
