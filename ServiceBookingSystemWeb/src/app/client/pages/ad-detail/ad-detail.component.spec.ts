import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdDetailComponent } from './ad-detail.component';

describe('AdDetailComponent', () => {
  let component: AdDetailComponent;
  let fixture: ComponentFixture<AdDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdDetailComponent]
    });
    fixture = TestBed.createComponent(AdDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
