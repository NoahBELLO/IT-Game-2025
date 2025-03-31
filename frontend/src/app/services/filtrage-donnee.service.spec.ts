import { TestBed } from '@angular/core/testing';

import { FiltrageDonneeService } from './filtrage-donnee.service';

describe('FiltrageDonneeService', () => {
  let service: FiltrageDonneeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltrageDonneeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
