import { TestBed } from '@angular/core/testing';

import { ApivirustotalService } from './apivirustotal.service';

describe('ApivirustotalService', () => {
  let service: ApivirustotalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApivirustotalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
