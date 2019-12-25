import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastOrdersComponent } from './last-orders.component';

describe('LastOrdersComponent', () => {
  let component: LastOrdersComponent;
  let fixture: ComponentFixture<LastOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
