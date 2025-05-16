import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdsComponent } from './all-ads.component';

describe('AllAdsComponent', () => {
  let component: AllAdsComponent;
  let fixture: ComponentFixture<AllAdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllAdsComponent]
    });
    fixture = TestBed.createComponent(AllAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
