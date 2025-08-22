import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { firstValueFrom, map, of } from 'rxjs';

import { AccountRelatedActionsComponent } from '@accounts/shared/account-related-actions/account-related-actions.component';
import { mockAccountResults, operatorUserRole, regulatorUserRole } from '@accounts/testing/mock-data';
import { AuthStore } from '@core/store/auth';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { AccountStatusPipe } from '@shared/pipes/account-status.pipe';
import { AccountStatusTagColorPipe } from '@shared/pipes/account-status-tag-color.pipe';
import { ActivatedRouteStub, BasePage, mockClass } from '@testing';

import { GovukComponentsModule } from 'govuk-components';

import { OrganisationAccountsService } from 'esos-api';

import { AccountsListComponent } from '../..';
import { AccountsStore } from '../../store';
import { AccountsPageComponent } from '.';

describe('AccountsPageComponent', () => {
  let component: AccountsPageComponent;
  let fixture: ComponentFixture<AccountsPageComponent>;
  let page: Page;
  let authStore: AuthStore;
  const organisationAccountsService = mockClass(OrganisationAccountsService);

  class Page extends BasePage<AccountsPageComponent> {
    get heading() {
      return this.query<HTMLElement>('esos-page-heading');
    }

    set termValue(value: string) {
      this.setInputValue('#term', value);
    }

    get termErrorMessage() {
      return this.query<HTMLElement>('div[formcontrolname="term"] span.govuk-error-message');
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }

    get accounts() {
      return this.queryAll<HTMLLIElement>('form#search-form ul.govuk-list > li');
    }

    get accountNames() {
      return this.queryAll<HTMLLIElement>('form#search-form ul.govuk-list > li a');
    }

    get accountRelatedActions() {
      return this.query<HTMLElement>('esos-account-related-actions');
    }

    get accountStatuses() {
      return this.queryAll<HTMLSpanElement>('govuk-tag');
    }
  }

  const createComponent = async () => {
    fixture = TestBed.createComponent(AccountsPageComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    jest.clearAllMocks();
  };

  const createModule = async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountsPageComponent, AccountsListComponent, AccountStatusPipe],
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        GovukComponentsModule,
        PageHeadingComponent,
        AccountStatusTagColorPipe,
      ],
      providers: [AccountsStore, { provide: OrganisationAccountsService, useValue: organisationAccountsService }],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
  };

  describe('for operators', () => {
    beforeEach(async () => {
      organisationAccountsService.getCurrentUserOrganisationAccounts.mockReturnValueOnce(of(mockAccountResults));
    });

    beforeEach(createModule);
    beforeEach(createComponent);

    beforeEach(async () => {
      authStore.setUserState(operatorUserRole);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display appropriate HTML elements', async () => {
      expect(page.heading.textContent.trim()).toEqual('Accounts');
      expect(page.accountRelatedActions).toBeFalsy();
    });

    it('should show results upon loading the page', () => {
      expect(page.accountNames.map((accountName) => accountName.textContent.trim())).toEqual([
        'account1',
        'account2',
        'account3',
      ]);
    });

    it('should show error when term less than 3 characters and pressing search button', async () => {
      page.termValue = 'te';
      page.submitButton.click();
      fixture.detectChanges();
      expect(page.termErrorMessage.textContent.trim()).toContain('Enter at least 3 characters');
    });

    it('should show accounts when term filled and pressing search button', async () => {
      page.termValue = 'term';
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.termErrorMessage).toBeNull();
      expect(organisationAccountsService.getCurrentUserOrganisationAccounts).toHaveBeenCalledTimes(2);
      expect(organisationAccountsService.getCurrentUserOrganisationAccounts).toHaveBeenLastCalledWith(0, 30, 'term');
      expect(page.accountNames.map((accountName) => accountName.textContent.trim())).toEqual([
        'account1',
        'account2',
        'account3',
      ]);
      expect(page.accountStatuses.map((accountStatus) => accountStatus.textContent.trim())).toEqual([
        'LIVE',
        'LIVE',
        'LIVE',
      ]);
    });
  });

  describe('for non operator users', () => {
    beforeEach(() => {
      organisationAccountsService.getCurrentUserOrganisationAccounts.mockReturnValue(of(mockAccountResults));
    });
    beforeEach(createModule);
    beforeEach(createComponent);

    beforeEach(async () => {
      authStore.setUserState(regulatorUserRole);
      fixture.detectChanges();
    });

    it('should create', async () => {
      expect(component).toBeTruthy();
    });

    it('should render the heading', async () => {
      expect(page.heading.textContent.trim()).toEqual('Accounts');
    });

    it('should show accounts when term filled and pressing search button', async () => {
      page.termValue = 'term';
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.termErrorMessage).toBeNull();
      expect(organisationAccountsService.getCurrentUserOrganisationAccounts).toHaveBeenCalledTimes(2);
      expect(organisationAccountsService.getCurrentUserOrganisationAccounts).toHaveBeenLastCalledWith(0, 30, 'term');
      expect(page.accountNames.map((accountName) => accountName.textContent.trim())).toEqual([
        'account1',
        'account2',
        'account3',
      ]);
      expect(page.accountStatuses.map((accountStatus) => accountStatus.textContent.trim())).toEqual([
        'LIVE',
        'LIVE',
        'LIVE',
      ]);
    });
  });

  describe('for regulators with search params set', () => {
    const activatedRouteStub = new ActivatedRouteStub(
      undefined,
      {
        term: 'account',
      },
      undefined,
    );

    beforeEach(async () => {
      organisationAccountsService.getCurrentUserOrganisationAccounts.mockReturnValueOnce(of(mockAccountResults));
    });
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [AccountsPageComponent, AccountsListComponent, AccountStatusPipe],
        imports: [
          RouterModule.forRoot([]),
          ReactiveFormsModule,
          GovukComponentsModule,
          PageHeadingComponent,
          AccountRelatedActionsComponent,
          AccountStatusTagColorPipe,
        ],
        providers: [
          AccountsStore,
          { provide: OrganisationAccountsService, useValue: organisationAccountsService },
          { provide: ActivatedRoute, useValue: activatedRouteStub },
        ],
      }).compileComponents();

      authStore = TestBed.inject(AuthStore);
    });
    beforeEach(createComponent);
    beforeEach(async () => {
      authStore.setUserState(regulatorUserRole);
      authStore.setRegulatorPermissions({
        MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: 'EXECUTE',
      });
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display appropriate HTML elements', async () => {
      expect(page.heading.textContent.trim()).toEqual('Accounts');
      expect(page.accountRelatedActions).toBeTruthy();
    });

    it('should load the accounts based on the query params', () => {
      expect(page.accountNames.map((accountName) => accountName.textContent.trim())).toEqual([
        'account1',
        'account2',
        'account3',
      ]);
      expect(page.accountStatuses.map((accountStatus) => accountStatus.textContent.trim())).toEqual([
        'LIVE',
        'LIVE',
        'LIVE',
      ]);
    });
  });

  describe('for verifier users without accounts appointed to verification body', () => {
    beforeEach(async () => {
      organisationAccountsService.getCurrentUserOrganisationAccounts.mockReturnValue(of({ accounts: [], total: 0 }));
    });
    beforeEach(createModule);
    beforeEach(() => {
      authStore.setUserState({
        ...authStore.getState().userState,
        status: 'ENABLED',
        roleType: 'VERIFIER',
        userId: 'asdf4',
      });
    });
    beforeEach(async () => {
      await createComponent();
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render the appropriate heading', async () => {
      await expect(firstValueFrom(component.vm$.pipe(map((vm) => vm.userRoleType)))).resolves.toEqual('VERIFIER');
      expect(page.heading.textContent.trim()).toEqual('There are no accounts to view.');
    });
  });
});
