import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom, of } from 'rxjs';

import {
  AuthStore,
  initialState,
  selectIsLoggedIn,
  selectTerms,
  selectUser,
  selectUserProfile,
  selectUserState,
} from '@core/store';
import { ActivatedRouteSnapshotStub, mockClass } from '@testing';
import { KeycloakService } from 'keycloak-angular';

import { AuthoritiesService, TermsAndConditionsService, TermsDTO, UsersService, UserStateDTO } from 'esos-api';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let authStore: AuthStore;
  let activatedRoute: ActivatedRoute;

  const keycloakService = mockClass(KeycloakService);
  const user = {
    email: 'test@test.com',
    firstName: 'test',
    lastName: 'test',
    termsVersion: 1,
  };
  const userState: UserStateDTO = {
    status: 'ENABLED',
    roleType: 'OPERATOR',
    userId: 'opTestId',
  };

  const usersService: Partial<jest.Mocked<UsersService>> = {
    getCurrentUser: jest.fn().mockReturnValue(of(user)),
  };

  const authoritiesService: Partial<jest.Mocked<AuthoritiesService>> = {
    getCurrentUserState: jest.fn().mockReturnValue(of(userState)),
  };

  const terms: TermsDTO = { url: '/test', version: 1 };
  const termsService: Partial<jest.Mocked<TermsAndConditionsService>> = {
    getLatestTerms: jest.fn().mockReturnValue(of(terms)),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: KeycloakService, useValue: keycloakService },
        { provide: UsersService, useValue: usersService },
        { provide: AuthoritiesService, useValue: authoritiesService },
        { provide: TermsAndConditionsService, useValue: termsService },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    service = TestBed.inject(AuthService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    keycloakService.loadUserProfile.mockResolvedValue({ email: 'test@test.com' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', async () => {
    await service.login();
    await service.loadUser();

    expect(keycloakService.login).toHaveBeenCalledTimes(1);
    expect(keycloakService.login).toHaveBeenCalledWith({ 'redirectUri': 'http://localhost' });
    expect(usersService.getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('should logout', async () => {
    await service.logout();

    expect(keycloakService.logout).toHaveBeenCalled();
  });

  it('should load and update user status', async () => {
    await expect(firstValueFrom(authStore.pipe(selectUserState))).resolves.toBeNull();
    await expect(firstValueFrom(service.loadUserState())).resolves.toEqual(userState);
    await expect(firstValueFrom(authStore.pipe(selectUserState))).resolves.toEqual(userState);
  });

  it('should update all user info when checkUser is called', async () => {
    await expect(firstValueFrom(authStore.asObservable())).resolves.toEqual(initialState);
    keycloakService.isLoggedIn.mockReturnValueOnce(false);

    await expect(firstValueFrom(service.checkUser())).resolves.toBeUndefined();

    await expect(firstValueFrom(authStore.pipe(selectIsLoggedIn))).resolves.toBeFalsy();
    await expect(firstValueFrom(authStore.pipe(selectUserState))).resolves.toBeNull();
    await expect(firstValueFrom(authStore.pipe(selectTerms))).resolves.toBeNull();
    await expect(firstValueFrom(authStore.pipe(selectUser))).resolves.toBeNull();
    await expect(firstValueFrom(authStore.pipe(selectUserProfile))).resolves.toBeNull();

    authStore.setIsLoggedIn(null);
    keycloakService.isLoggedIn.mockReturnValueOnce(true);

    await expect(firstValueFrom(service.checkUser())).resolves.toBeUndefined();

    await expect(firstValueFrom(authStore.pipe(selectIsLoggedIn))).resolves.toBeTruthy();
    await expect(firstValueFrom(authStore.pipe(selectUserState))).resolves.toEqual(userState);
    await expect(firstValueFrom(authStore.pipe(selectTerms))).resolves.toEqual(terms);
    await expect(firstValueFrom(authStore.pipe(selectUser))).resolves.toEqual(user);
    await expect(firstValueFrom(authStore.pipe(selectUserProfile))).resolves.toEqual({ email: 'test@test.com' });
  });

  it('should not update user info if logged in is already determined', async () => {
    authStore.setIsLoggedIn(false);
    const spy = jest.spyOn(service, 'loadUserState');

    await expect(firstValueFrom(service.checkUser())).resolves.toBeUndefined();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should redirect to origin if leaf data is blocking sign in redirect', async () => {
    (<any>activatedRoute.snapshot) = new ActivatedRouteSnapshotStub(undefined, undefined, {
      blockSignInRedirect: true,
    });

    await service.login();

    expect(keycloakService.login).toHaveBeenCalledTimes(1);
    expect(keycloakService.login).toHaveBeenCalledWith({ redirectUri: location.origin });
  });
});
