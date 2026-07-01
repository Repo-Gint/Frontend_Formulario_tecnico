import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { tecnicoGuardGuard } from './tecnico-guard-guard';

describe('tecnicoGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => tecnicoGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
