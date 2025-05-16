import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupClientComponent } from './signup-client.component';

describe('SignupClientComponent', () => {
  let component: SignupClientComponent;
  let fixture: ComponentFixture<SignupClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupClientComponent]
    });
    fixture = TestBed.createComponent(SignupClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
