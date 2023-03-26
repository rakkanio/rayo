import { TestBed } from '@angular/core/testing';

import { AlgoApiService } from './algo-api.service';

describe('AlgoApiService', () => {
  let service: AlgoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
