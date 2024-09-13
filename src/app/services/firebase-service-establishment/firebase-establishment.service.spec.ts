import { TestBed } from '@angular/core/testing';

import { FirebaseEstablishmentService } from './firebase-establishment.service';

describe('FirebaseEstablishmentService', () => {
  let service: FirebaseEstablishmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseEstablishmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
