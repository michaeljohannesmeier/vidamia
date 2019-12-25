import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckouterrorComponent } from './checkouterror.component';

describe('CheckouterrorComponent', () => {
  let component: CheckouterrorComponent;
  let fixture: ComponentFixture<CheckouterrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckouterrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckouterrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
