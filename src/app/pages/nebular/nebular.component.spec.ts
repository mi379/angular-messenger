import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NebularComponent } from './nebular.component';

describe('NebularComponent', () => {
  let component: NebularComponent;
  let fixture: ComponentFixture<NebularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NebularComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NebularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
