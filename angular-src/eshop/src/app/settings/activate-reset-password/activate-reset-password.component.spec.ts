import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateResetPasswordComponent } from './activate-reset-password.component';

describe('ActivateResetPasswordComponent', () => {
  let component: ActivateResetPasswordComponent;
  let fixture: ComponentFixture<ActivateResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
