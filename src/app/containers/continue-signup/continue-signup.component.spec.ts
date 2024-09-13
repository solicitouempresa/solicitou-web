import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueSignupComponent } from './continue-signup.component';

describe('ContinueSignupComponent', () => {
  let component: ContinueSignupComponent;
  let fixture: ComponentFixture<ContinueSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContinueSignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContinueSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
