import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartFooterComponent } from './cart-footer.component';

describe('FooterComponent', () => {
  let component: CartFooterComponent;
  let fixture: ComponentFixture<CartFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
