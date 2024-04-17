import { TestBed } from '@angular/core/testing';

import { JflixComponentsService } from './jflix-components.service';

describe('JflixComponentsService', () => {
  let service: JflixComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JflixComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
