import { TestBed, inject } from '@angular/core/testing';

import { D3HelperService } from './d3-helper.service';

describe('D3HelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [D3HelperService]
    });
  });

  it('should be created', inject([D3HelperService], (service: D3HelperService) => {
    expect(service).toBeTruthy();
  }));
});
