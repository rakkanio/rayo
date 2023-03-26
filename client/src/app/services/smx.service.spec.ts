import { TestBed, inject } from '@angular/core/testing';

import { SmxService } from './smx.service';

describe('SmxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmxService]
    });
  });

  it('should be created', inject([SmxService], (service: SmxService) => {
    expect(service).toBeTruthy();
  }));
});
