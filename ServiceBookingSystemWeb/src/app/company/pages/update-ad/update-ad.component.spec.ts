import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAdComponent } from './update-ad.component';

describe('UpdateAdComponent', () => {
  let component: UpdateAdComponent;
  let fixture: ComponentFixture<UpdateAdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAdComponent]
    });
    fixture = TestBed.createComponent(UpdateAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
