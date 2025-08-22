import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { firstValueFrom, of, throwError } from 'rxjs';

import { AuthStore } from '@core/store/auth';
import { BusinessTestingModule, expectBusinessErrorToBe } from '@error/testing/business-error';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, asyncData, BasePage, MockType } from '@testing';

import { AuthoritiesService, RegulatorAuthoritiesService, RegulatorUserDTO, RegulatorUsersService } from 'esos-api';

import { SharedUserModule } from '../../shared-user/shared-user.module';
import { saveNotFoundRegulatorError } from '../errors/business-error';
import {
  mockRegulatorBasePermissions,
  mockRegulatorPermissionGroups,
  mockRegulatorRolePermissions,
  mockRegulatorUser,
  mockRegulatorUserStatus,
} from '../testing/mock-data';
import { DetailsComponent } from './details.component';

describe('RegulatorDetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let activatedRoute: ActivatedRouteStub;
  let authStore: AuthStore;
  let regulatorUsersService: MockType<RegulatorUsersService>;
  let authoritiesService: MockType<AuthoritiesService>;
  let regulatorAuthoritiesService: MockType<RegulatorAuthoritiesService>;
  let router: Router;
  let page: Page;

  class Page extends BasePage<DetailsComponent> {
    get firstNameValue() {
      return this.getInputValue('#user.firstName');
    }

    set firstNameValue(value: string) {
      this.setInputValue('#user.firstName', value);
    }

    get lastNameValue() {
      return this.getInputValue('#user.lastName');
    }

    set lastNameValue(value: string) {
      this.setInputValue('#user.lastName', value);
    }

    get emailValue() {
      return this.getInputValue('#user.email');
    }

    set emailValue(value: string) {
      this.setInputValue('#user.email', value);
    }

    get jobTitleValue() {
      return this.getInputValue('#user.jobTitle');
    }

    set jobTitleValue(value: string) {
      this.setInputValue('#user.jobTitle', value);
    }

    get phoneNumberValue() {
      return this.getInputValue('#user.phoneNumber');
    }

    set phoneNumberValue(value: string) {
      this.setInputValue('#user.phoneNumber', value);
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }

    get errorSummary() {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get confirmationPanel() {
      return this.query<HTMLDivElement>('.govuk-panel');
    }

    get links() {
      return this.queryAll<HTMLLinkElement>('a');
    }

    get twoFaLink() {
      return this.query<HTMLLinkElement>('esos-two-fa-link');
    }

    get basePermissionButtonRegulatorAdmin() {
      return this.query<HTMLButtonElement>('#regulator_admin_team');
    }

    get basePermissionButtonRegulatortechnicalOfficer() {
      return this.query<HTMLButtonElement>('#regulator_technical_officer');
    }

    get basePermissionButtonRegulatorTeamLeader() {
      return this.query<HTMLButtonElement>('#regulator_team_leader');
    }

    get basePermissionButtonCASuperUser() {
      return this.query<HTMLButtonElement>('#ca_super_user');
    }

    get basePermissionButtonPmrvSuperUser() {
      return this.query<HTMLButtonElement>('#service_super_user');
    }
  }

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub();
    regulatorUsersService = {
      inviteRegulatorUserToCA: jest.fn().mockReturnValue(asyncData(null)),
      updateCurrentRegulatorUser: jest.fn().mockReturnValue(asyncData(null)),
      updateRegulatorUserByCaAndId: jest.fn().mockReturnValue(asyncData(null)),
    };
    authoritiesService = {
      getRegulatorRoles: jest.fn().mockReturnValue(asyncData(mockRegulatorBasePermissions)),
    };
    regulatorAuthoritiesService = {
      getRegulatorPermissionGroupLevels: jest.fn().mockReturnValue(asyncData(mockRegulatorPermissionGroups)),
    };

    await TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      imports: [SharedModule, RouterModule.forRoot([]), SharedUserModule, BusinessTestingModule, PageHeadingComponent],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AuthoritiesService, useValue: authoritiesService },
        { provide: RegulatorUsersService, useValue: regulatorUsersService },
        { provide: RegulatorAuthoritiesService, useValue: regulatorAuthoritiesService },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setIsLoggedIn(true);
    authStore.setUserState(mockRegulatorUserStatus);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  describe('Edit user', () => {
    beforeEach(() => {
      activatedRoute.setParamMap({ userId: '222' });
      activatedRoute.setResolveMap(mockRegulatorUser);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should change header and button text', () => {
      expect(fixture.nativeElement.querySelector('h1').textContent).toEqual('User details');
      expect(page.submitButton.textContent.trim()).toEqual('Save');
    });

    it('should prefill with data the regulator form when editing a user', async () => {
      expect(page.firstNameValue).toEqual('John');
      expect(page.lastNameValue).toEqual('Doe');
      expect(page.emailValue).toEqual('test@host.com');
      expect(page.jobTitleValue).toEqual('developer');
      expect(page.phoneNumberValue).toEqual('23456');
      expect(component.form.get('permissions.ASSIGN_REASSIGN_TASKS').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_USERS_AND_CONTACTS').value).toEqual('NONE');
      expect(component.form.get('permissions.REVIEW_ORGANISATION_ACCOUNT').value).toEqual('VIEW_ONLY');
      expect(component.form.get('permissions.MANAGE_VERIFIED_ORGANISATION_ACCOUNTS').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_PARTICIPANT_USERS').value).toEqual('NONE');
      expect(component.form.get('permissions.ACCOUNT_CLOSURE').value).toEqual('NONE');
      expect(component.form.get('permissions.RETURN_NOC').value).toEqual('NONE');
      expect(component.form.get('permissions.RETURN_ACTION_PLAN').value).toEqual('NONE');
      expect(component.form.get('permissions.RETURN_PROGRESS_UPDATE_1').value).toEqual('NONE');
      expect(component.form.get('permissions.RETURN_PROGRESS_UPDATE_2').value).toEqual('NONE');
      expect(component.form.get('user.email').disabled).toBeTruthy();

      await expect(firstValueFrom(component.allowEditPermissions$)).resolves.toBeTruthy();
      await expect(firstValueFrom(component.userPermissions$)).resolves.toEqual(
        mockRegulatorUser.permissions.permissions,
      );
    });

    it('should save changes when editing current user', () => {
      authStore.setUserState({ ...mockRegulatorUserStatus, userId: '222' });
      const newFirstName = 'Mary';

      page.firstNameValue = newFirstName;
      fixture.detectChanges();

      page.submitButton.click();

      expect(regulatorUsersService.updateCurrentRegulatorUser).toHaveBeenCalledWith(
        {
          permissions: mockRegulatorUser.permissions.permissions,
          user: {
            ...mockRegulatorUser.user,
            firstName: newFirstName,
          },
        },
        null,
      );
    });

    it('should save changes when editing another user', () => {
      authStore.setUserState(mockRegulatorUserStatus);
      const newFirstName = 'Mary';

      page.firstNameValue = newFirstName;
      fixture.detectChanges();

      page.submitButton.click();
      fixture.detectChanges();

      expect(regulatorUsersService.updateRegulatorUserByCaAndId).toHaveBeenCalledWith(
        '222',
        {
          permissions: mockRegulatorUser.permissions.permissions,
          user: { ...mockRegulatorUser.user, firstName: newFirstName },
        },
        null,
      );
    });

    it('should redirect to the list after save', () => {
      const navSpy = jest.spyOn(router, 'navigate');

      page.firstNameValue = 'Mary';
      fixture.detectChanges();

      page.submitButton.click();
      fixture.detectChanges();

      expect(navSpy).toHaveBeenCalledTimes(1);
      expect(navSpy).toHaveBeenCalledWith(['../../regulators'], { relativeTo: activatedRoute });
      expect(page.confirmationPanel).toBeFalsy();
    });

    it('should throw an error when updating a deleted user', async () => {
      regulatorUsersService.updateRegulatorUserByCaAndId.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 400, error: { code: 'AUTHORITY1003' } })),
      );

      page.firstNameValue = 'Mary';
      fixture.detectChanges();

      page.submitButton.click();
      fixture.detectChanges();

      await expectBusinessErrorToBe(saveNotFoundRegulatorError);
    });

    it('should fill the form with predefined permissions when user role buttons are clicked', () => {
      const getPermission = (name: string) =>
        mockRegulatorBasePermissions.find((permission) => permission.code === name);
      const element: HTMLElement = fixture.nativeElement;

      const buttonIds = [
        'regulator_admin_team',
        'ca_super_user',
        'regulator_team_leader',
        'regulator_admin_team',
        'service_super_user',
      ];

      buttonIds.forEach((buttonId) => {
        const btnElement = element.querySelector<HTMLButtonElement>('#' + buttonId);
        btnElement.click();
        fixture.detectChanges();

        expect(authoritiesService.getRegulatorRoles).toHaveBeenCalled();
        const basePermission = getPermission(buttonId);

        mockRegulatorRolePermissions.forEach((rolePermission) =>
          expect(component.form.get(`permissions.${rolePermission}`).value).toEqual(
            basePermission.rolePermissions[rolePermission],
          ),
        );
      });
    });

    it('should display the change 2fa link when editing current user', async () => {
      authStore.setUserState({ ...mockRegulatorUserStatus, userId: '222' });
      activatedRoute.setParamMap({ userId: '222' });

      await expect(firstValueFrom(component.isLoggedUser$)).resolves.toEqual(true);
    });

    it('should display the reset 2fa link when editing other user', async () => {
      authStore.setUserState({ ...mockRegulatorUserStatus, userId: '2' });
      activatedRoute.setParamMap({ userId: '222' });

      page.firstNameValue = 'Mary';
      fixture.detectChanges();

      await expect(firstValueFrom(component.isLoggedUser$)).resolves.toEqual(false);
      fixture.detectChanges();
      expect(page.twoFaLink.textContent.trim()).toEqual('Reset two-factor authentication');
    });
  });

  describe('View user', () => {
    beforeEach(() => {
      activatedRoute.setParamMap({ userId: '222' });
      activatedRoute.setResolveMap({
        user: mockRegulatorUser.user,
        permissions: { ...mockRegulatorUser.permissions, editable: false },
      });
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show user in view mode when edit is not allowed', () => {
      const element: HTMLElement = fixture.nativeElement;
      expect(element.querySelector('#check-ASSIGN_REASSIGN_TASKS-NONE')).toBeTruthy();
      expect(element.querySelector('#check-MANAGE_USERS_AND_CONTACTS-NONE')).toBeTruthy();
      expect(element.querySelector('#check-REVIEW_ORGANISATION_ACCOUNT-VIEW_ONLY')).toBeTruthy();
      expect(element.querySelector('#check-MANAGE_VERIFIED_ORGANISATION_ACCOUNTS-NONE')).toBeTruthy();
      expect(element.querySelector('#check-MANAGE_PARTICIPANT_USERS-NONE')).toBeTruthy();
    });

    it('should not display the 2fa link', async () => {
      authStore.setUserState({ ...mockRegulatorUserStatus, userId: '222' });
      activatedRoute.setParamMap({ userId: '222' });

      expect(page.twoFaLink).toBeFalsy();
    });
  });

  describe('Add new user', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render header and button text for add new user', () => {
      expect(fixture.nativeElement.querySelector('h1').textContent).toEqual('Add a new user');
      expect(page.submitButton.textContent.trim()).toEqual('Submit');
      expect(fixture.nativeElement.querySelector('button[id="regulator_admin_team"]')).toBeTruthy();
    });

    it('should save a new user', () => {
      fixture.detectChanges();

      expect(page.submitButton.disabled).toBeFalsy();

      page.firstNameValue = mockRegulatorUser.user.firstName;
      page.lastNameValue = mockRegulatorUser.user.lastName;
      page.emailValue = mockRegulatorUser.user.email;
      page.jobTitleValue = (mockRegulatorUser.user as RegulatorUserDTO).jobTitle;

      fixture.detectChanges();

      expect(component.form.get('permissions.ASSIGN_REASSIGN_TASKS').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_USERS_AND_CONTACTS').value).toEqual('NONE');
      expect(component.form.get('permissions.REVIEW_ORGANISATION_ACCOUNT').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_VERIFIED_ORGANISATION_ACCOUNTS').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_PARTICIPANT_USERS').value).toEqual('NONE');

      page.submitButton.click();
      fixture.detectChanges();
      expect(regulatorUsersService.inviteRegulatorUserToCA).not.toHaveBeenCalled();

      page.phoneNumberValue = (mockRegulatorUser.user as RegulatorUserDTO).phoneNumber;
      page.submitButton.click();
      fixture.detectChanges();
      expect(regulatorUsersService.inviteRegulatorUserToCA).toHaveBeenCalled();
    });

    it('should show errors if email already exists', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      fixture.detectChanges();

      page.firstNameValue = mockRegulatorUser.user.firstName;
      page.lastNameValue = mockRegulatorUser.user.lastName;
      page.emailValue = mockRegulatorUser.user.email;
      page.jobTitleValue = (mockRegulatorUser.user as RegulatorUserDTO).jobTitle;

      expect(component.form.get('permissions.ASSIGN_REASSIGN_TASKS').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_USERS_AND_CONTACTS').value).toEqual('NONE');
      expect(component.form.get('permissions.REVIEW_ORGANISATION_ACCOUNT').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_VERIFIED_ORGANISATION_ACCOUNTS').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_PARTICIPANT_USERS').value).toEqual('NONE');

      page.submitButton.click();
      fixture.detectChanges();
      expect(regulatorUsersService.inviteRegulatorUserToCA).not.toHaveBeenCalled();

      page.phoneNumberValue = (mockRegulatorUser.user as RegulatorUserDTO).phoneNumber;
      regulatorUsersService.inviteRegulatorUserToCA.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 400, error: { code: 'USER1001' } })),
      );
      page.submitButton.click();
      fixture.detectChanges();
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(component.form.valid).toBeFalsy();
      expect(page.errorSummary.textContent).toContain('This user email already exists in the service');

      page.emailValue = 'test@email.com';
      regulatorUsersService.inviteRegulatorUserToCA.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 400, error: { code: 'AUTHORITY1005' } })),
      );
      page.submitButton.click();
      fixture.detectChanges();
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(component.form.valid).toBeFalsy();
      expect(page.errorSummary.textContent).toContain('This user email already exists in the service');
    });

    it('should show confirmation when saving', () => {
      regulatorUsersService.inviteRegulatorUserToCA.mockReturnValueOnce(of(null));
      const navSpy = jest.spyOn(router, 'navigate');

      page.firstNameValue = mockRegulatorUser.user.firstName;
      page.lastNameValue = mockRegulatorUser.user.lastName;
      page.emailValue = mockRegulatorUser.user.email;
      page.jobTitleValue = (mockRegulatorUser.user as RegulatorUserDTO).jobTitle;
      page.phoneNumberValue = (mockRegulatorUser.user as RegulatorUserDTO).phoneNumber;

      expect(component.form.get('permissions.ASSIGN_REASSIGN_TASKS').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_USERS_AND_CONTACTS').value).toEqual('NONE');
      expect(component.form.get('permissions.REVIEW_ORGANISATION_ACCOUNT').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_VERIFIED_ORGANISATION_ACCOUNTS').value).toEqual('NONE');
      expect(component.form.get('permissions.MANAGE_PARTICIPANT_USERS').value).toEqual('NONE');

      fixture.detectChanges();
      page.submitButton.click();
      fixture.detectChanges();

      expect(regulatorUsersService.inviteRegulatorUserToCA).toHaveBeenCalledTimes(1);
      expect(page.confirmationPanel).toBeTruthy();
      expect(navSpy).not.toHaveBeenCalled();
    });

    it('should not display the 2fa link', async () => {
      authStore.setUserState({ ...mockRegulatorUserStatus, userId: '2' });
      activatedRoute.setParamMap({ userId: '222' });

      expect(page.twoFaLink).toBeFalsy();
    });

    it('should set aria-pressed attribute for the pressed base permission buttons when user role buttons are clicked', () => {
      expect(page.basePermissionButtonRegulatorAdmin.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonCASuperUser.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonPmrvSuperUser.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonRegulatorTeamLeader.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonRegulatortechnicalOfficer.getAttribute('aria-pressed')).toEqual('false');

      page.basePermissionButtonRegulatortechnicalOfficer.click();
      fixture.detectChanges();

      expect(page.basePermissionButtonRegulatorAdmin.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonCASuperUser.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonPmrvSuperUser.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonRegulatorTeamLeader.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonRegulatortechnicalOfficer.getAttribute('aria-pressed')).toEqual('true');

      page.basePermissionButtonRegulatorAdmin.click();
      fixture.detectChanges();

      expect(page.basePermissionButtonRegulatorAdmin.getAttribute('aria-pressed')).toEqual('true');
      expect(page.basePermissionButtonCASuperUser.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonPmrvSuperUser.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonRegulatorTeamLeader.getAttribute('aria-pressed')).toEqual('false');
      expect(page.basePermissionButtonRegulatortechnicalOfficer.getAttribute('aria-pressed')).toEqual('false');
    });
  });
});
