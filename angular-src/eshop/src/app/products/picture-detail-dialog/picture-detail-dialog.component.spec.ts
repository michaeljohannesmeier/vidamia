import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureDetailDialogComponent } from './picture-detail-dialog.component';

describe('PictureDetailDialogComponent', () => {
  let component: PictureDetailDialogComponent;
  let fixture: ComponentFixture<PictureDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
