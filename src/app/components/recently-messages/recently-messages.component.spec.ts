import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyMessagesComponent } from './recently-messages.component';

describe('RecentlyMessagesComponent', () => {
  let component: RecentlyMessagesComponent;
  let fixture: ComponentFixture<RecentlyMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyMessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
