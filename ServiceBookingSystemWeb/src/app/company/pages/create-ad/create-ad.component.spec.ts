import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdComponent } from './create-ad.component';

describe('CreateAdComponent', () => {
  let component: CreateAdComponent;
  let fixture: ComponentFixture<CreateAdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAdComponent]
    });
    fixture = TestBed.createComponent(CreateAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
