import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, of } from 'rxjs';

import {
  mockAuthorityService,
  mockAuthService,
  mockKeycloakService,
  mockTermsAndConditionsService,
  mockUsersService,
} from '@core/guards/mocks';
import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store/auth';
import { ActivatedRouteStub } from '@testing';
import { KeycloakService } from 'keycloak-angular';

import { AuthoritiesService, TermsAndConditionsService, UsersService } from 'esos-api';

import { TermsAndConditionsGuard } from './terms-and-conditions.guard';

describe('TermsAndConditionsGuard', () => {
  let guard: TermsAndConditionsGuard;
  let authStore: AuthStore;
  let router: Router;
  const route = new ActivatedRouteStub();

  mockAuthService.checkUser.mockReturnValue(of(undefined));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: KeycloakService, useValue: mockKeycloakService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthoritiesService, useValue: mockAuthorityService },
        { provide: TermsAndConditionsService, useValue: mockTermsAndConditionsService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setTerms({ version: 1 } as any);
    router = TestBed.inject(Router);
    guard = TestBed.inject(TermsAndConditionsGuard);
  });

  afterEach(() => {
    mockAuthService.checkUser.mockClear();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it("should allow access when url is '/terms' and terms versions differ", async () => {
    authStore.setUser({ termsVersion: 2 } as any);
    const state: any = { url: '/terms' };
    const result = await lastValueFrom(guard.canActivate(null, state));
    expect(result).toEqual(true);
    expect(mockAuthService.checkUser).toHaveBeenCalledTimes(1);
  });

  it("should disallow access when url is '/terms' and terms versions are equal", async () => {
    authStore.setUser({ termsVersion: 1 } as any);
    const state: any = { url: '/terms' };
    const result = await lastValueFrom(guard.canActivate(null, state));
    expect(result).toEqual(router.parseUrl('landing'));
    expect(mockAuthService.checkUser).toHaveBeenCalledTimes(1);
  });

  it('should allow access when terms versions are equal', async () => {
    authStore.setUser({ termsVersion: 1 } as any);
    const result = await lastValueFrom(guard.canActivate(null, { url: '' } as any));
    expect(result).toEqual(true);
    expect(mockAuthService.checkUser).toHaveBeenCalledTimes(1);
  });

  it('should disallow access when terms versions differ', async () => {
    authStore.setUser({ termsVersion: 2 } as any);
    const result = await lastValueFrom(guard.canActivate(null, { url: '' } as any));
    expect(result).toEqual(router.parseUrl('landing'));
    expect(mockAuthService.checkUser).toHaveBeenCalledTimes(1);
  });
});
