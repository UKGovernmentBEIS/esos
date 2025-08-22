import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, BasePage, mockClass } from '@testing';
import { provideZxvbnServiceForPSM } from 'angular-password-strength-meter/zxcvbn';

import { VerifierUsersRegistrationService } from 'esos-api';

import { PasswordService } from '../../shared-user/password/password.service';
import { SharedUserModule } from '../../shared-user/shared-user.module';
import { VerifierInvitationComponent } from './verifier-invitation.component';

describe('VerifierInvitationComponent', () => {
  let component: VerifierInvitationComponent;
  let fixture: ComponentFixture<VerifierInvitationComponent>;
  let page: Page;
  let router: Router;
  let route: ActivatedRoute;
  let verifierUsersRegistrationService: jest.Mocked<VerifierUsersRegistrationService>;
  let passwordService: Partial<jest.Mocked<PasswordService>>;

  class Page extends BasePage<VerifierInvitationComponent> {
    get emailValue() {
      return this.getInputValue<string>('#email');
    }

    set passwordValue(value: string) {
      this.setInputValue('#password', value);
    }

    set repeatedPasswordValue(value: string) {
      this.setInputValue('#validatePassword', value);
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  beforeEach(async () => {
    verifierUsersRegistrationService = mockClass(VerifierUsersRegistrationService);
    passwordService = mockClass(PasswordService);

    const activatedRoute = new ActivatedRouteStub(
      undefined,
      { token: 'token' },
      {
        invitedUser: { email: 'user@esos.uk' },
      },
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, PageHeadingComponent, SharedUserModule],
      declarations: [VerifierInvitationComponent],
      providers: [
        provideZxvbnServiceForPSM(),
        { provide: VerifierUsersRegistrationService, useValue: verifierUsersRegistrationService },
        { provide: PasswordService, useValue: passwordService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifierInvitationComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the form with email information', () => {
    expect(component.form.get('email').value).toEqual('user@esos.uk');
    expect(page.emailValue).toEqual('user@esos.uk');
  });

  it('should navigate for link related error', () => {
    verifierUsersRegistrationService.acceptAndEnableVerifierInvitedUser.mockReturnValue(
      throwError(() => new HttpErrorResponse({ error: { code: 'EMAIL1001' }, status: 400 })),
    );
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();
    passwordService.blacklisted.mockReturnValue(of(null));
    passwordService.strong.mockReturnValue(null);

    component.form.get('password').setValue('ThisIsAStrongP@ssw0rd');
    component.form.get('validatePassword').setValue('ThisIsAStrongP@ssw0rd');
    page.submitButton.click();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['invalid-link'], {
      relativeTo: route,
      queryParams: { code: 'EMAIL1001' },
    });

    verifierUsersRegistrationService.acceptAndEnableVerifierInvitedUser.mockReturnValue(
      throwError(() => new HttpErrorResponse({ error: { code: 'TOKEN1001' }, status: 400 })),
    );

    component.form.get('password').setValue('ThisIsAStrongP@ssw0rd');
    page.submitButton.click();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenCalledWith(['invalid-link'], {
      relativeTo: route,
      queryParams: { code: 'TOKEN1001' },
    });
  });

  it('should submit only if form valid', () => {
    page.passwordValue = '';
    page.repeatedPasswordValue = '';
    page.submitButton.click();
    fixture.detectChanges();

    expect(verifierUsersRegistrationService.acceptAndEnableVerifierInvitedUser).not.toHaveBeenCalled();

    page.passwordValue = 'test';
    page.submitButton.click();
    fixture.detectChanges();

    expect(verifierUsersRegistrationService.acceptAndEnableVerifierInvitedUser).not.toHaveBeenCalled();

    passwordService.blacklisted.mockReturnValue(of(null));
    passwordService.strong.mockReturnValue(null);
    page.passwordValue = 'ThisIsAStrongP@ssw0rd';
    page.repeatedPasswordValue = 'ThisIsAStrongP@ssw0rd';
    fixture.detectChanges();

    page.submitButton.click();
    fixture.detectChanges();
    expect(verifierUsersRegistrationService.acceptAndEnableVerifierInvitedUser).toHaveBeenCalledTimes(1);
    expect(verifierUsersRegistrationService.acceptAndEnableVerifierInvitedUser).toHaveBeenCalledWith({
      invitationToken: 'token',
      password: 'ThisIsAStrongP@ssw0rd',
    });
  });
});
