import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEstablishmentComponent } from './detail-establishment.component';

describe('DetailEstablishmentComponent', () => {
  let component: DetailEstablishmentComponent;
  let fixture: ComponentFixture<DetailEstablishmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailEstablishmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailEstablishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
