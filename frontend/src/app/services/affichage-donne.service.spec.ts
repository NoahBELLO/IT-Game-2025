import { TestBed } from '@angular/core/testing';

import { AffichageDonneService } from './affichage-donne.service';

describe('AffichageDonneService', () => {
  let service: AffichageDonneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffichageDonneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
