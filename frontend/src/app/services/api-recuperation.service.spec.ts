import { TestBed } from '@angular/core/testing';

import { ApiRecuperationService } from './api-recuperation.service';

describe('ApiRecuperationService', () => {
  let service: ApiRecuperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRecuperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
