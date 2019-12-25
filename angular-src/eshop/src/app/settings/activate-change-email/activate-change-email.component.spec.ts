import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateChangeEmailComponent } from './activate-change-email.component';

describe('ActivateChangeEmailComponent', () => {
  let component: ActivateChangeEmailComponent;
  let fixture: ComponentFixture<ActivateChangeEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateChangeEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateChangeEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
