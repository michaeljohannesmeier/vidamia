import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutconfirmComponent } from './checkoutconfirm.component';

describe('CheckoutconfirmComponent', () => {
  let component: CheckoutconfirmComponent;
  let fixture: ComponentFixture<CheckoutconfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutconfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
