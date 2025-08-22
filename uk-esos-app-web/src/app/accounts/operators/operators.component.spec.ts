import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { DeleteComponent, OperatorsComponent } from '@accounts/index';
import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store/auth';
import { BusinessTestingModule, expectBusinessErrorToBe } from '@error/testing/business-error';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, asyncData, BasePage, changeInputValue, MockType, RouterStubComponent } from '@testing';
import { cloneDeep } from 'lodash-es';

import {
  AccountVerificationBodyService,
  AuthoritiesService,
  OperatorAuthoritiesService,
  OrganisationAccountDTO,
  UserStateDTO,
} from 'esos-api';

import { mockedOrganisationAccount, mockOperatorListData, mockOperatorRoleCodes } from '../testing/mock-data';
import { savePartiallyNotFoundOperatorError } from './errors/business-error';

describe('OperatorsComponent', () => {
  let component: OperatorsComponent;
  let fixture: ComponentFixture<OperatorsComponent>;
  let page: Page;
  let router: Router;
  let accountVerificationBodyService: MockType<AccountVerificationBodyService>;
  let authStore: AuthStore;
  let authService: MockType<AuthService>;
  let activatedRouteStub: ActivatedRouteStub;

  class Page extends BasePage<OperatorsComponent> {
    get addUserFormButton() {
      return this.query<HTMLButtonElement>('form[id="add-user-form"] button[type="submit"]');
    }

    get usersForm() {
      return this.query<HTMLFormElement>('form[id="users-form"]');
    }

    get usersFormSubmitButton() {
      return this.usersForm.querySelector<HTMLButtonElement>('button[type="submit"]');
    }

    get nameSortingButton() {
      return this.usersForm.querySelector<HTMLButtonElement>('thead button');
    }

    get rows() {
      return Array.from(this.usersForm.querySelectorAll<HTMLTableRowElement>('tbody tr'));
    }

    get nameColumns() {
      return this.rows.map((row) => row.querySelector('td'));
    }

    get nameLinks() {
      return this.nameColumns.map((name) => name.querySelector('a'));
    }

    get roleSelects() {
      return this.queryAll<HTMLSelectElement>('select[name$=".roleCode"]');
    }

    get roleSelectsValue() {
      return this.roleSelects.map((select) => this.getInputValue(`#${select.id}`));
    }

    set roleSelectsValue(value: string[]) {
      this.roleSelects.forEach((select, index) => {
        if (value[index] !== undefined) {
          this.setInputValue(`#${select.id}`, value[index]);
        }
      });
    }

    get accountStatusSelects() {
      return this.queryAll<HTMLSelectElement>('select[name$=".authorityStatus"]');
    }

    get accountStatusSelectsValue() {
      return this.accountStatusSelects.map((select) => this.getInputValue(`#${select.id}`));
    }

    set accountStatusSelectsValue(value: string[]) {
      this.accountStatusSelects.forEach((select, index) => {
        if (value[index] !== undefined) {
          this.setInputValue(`#${select.id}`, value[index]);
        }
      });
    }

    get contactTypeSelect() {
      return this.rows.map((row) => row.querySelector<HTMLInputElement>('select[name$=".contactType"]'));
    }

    set contactTypeSelectsValue(value: string[]) {
      this.queryAll<HTMLSelectElement>('select[name$=".contactType"]').forEach((select, index) => {
        if (value[index] !== undefined) {
          this.setInputValue(`#${select.id}`, value[index]);
        }
      });
    }

    get locks() {
      return this.queryAll<HTMLDivElement>('.locked');
    }

    get errorSummary() {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get lastRow() {
      return this.rows[this.rows.length - 1];
    }

    get details() {
      return this.query<HTMLDetailsElement>('details.govuk-details');
    }

    get detailsSummary() {
      return this.query<HTMLSpanElement>('.govuk-details__summary-text');
    }
  }

  const operatorAuthoritiesService: MockType<OperatorAuthoritiesService> = {
    updateAccountOperatorAuthorities: jest.fn().mockReturnValue(of(null)),
    deleteAccountOperatorAuthority: jest.fn().mockReturnValue(of(null)),
    deleteCurrentUserAccountOperatorAuthority: jest.fn().mockReturnValue(of(null)),
    getAccountOperatorAuthorities: jest.fn().mockReturnValue(of(mockOperatorListData)),
  };

  const authoritiesService: MockType<AuthoritiesService> = {
    getOperatorRoleCodes: jest.fn().mockReturnValue(asyncData(mockOperatorRoleCodes)),
  };

  const setUser = (roleType: UserStateDTO['roleType'], loginStatus?) => {
    authStore.setUserState({
      ...authStore.getState().userState,
      status: loginStatus,
      userId: 'opTestId',
      roleType,
    });
  };
  const setUserAsOperator = () => setUser('OPERATOR');
  const setUserAsRegulator = () => setUser('REGULATOR');
  const expectUserOrderToBe = (indexes: number[]) =>
    expect(page.nameColumns.map((name) => name.textContent.trim())).toEqual(
      indexes.map(
        (index) =>
          `${mockOperatorListData.authorities[index].firstName} ${mockOperatorListData.authorities[index].lastName}`,
      ),
    );

  const createComponent = () => {
    fixture = TestBed.createComponent(OperatorsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  const createModule = async () => {
    accountVerificationBodyService = {
      getVerificationBodyOfAccount: jest.fn().mockReturnValue(throwError(() => ({ status: 404 }))),
    };
    activatedRouteStub = new ActivatedRouteStub({ accountId: mockedOrganisationAccount.id });
    authService = {
      loadUserState: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, BusinessTestingModule, SharedModule, PageHeadingComponent],
      declarations: [OperatorsComponent, DeleteComponent, RouterStubComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: authService },
        { provide: AuthoritiesService, useValue: authoritiesService },
        { provide: OperatorAuthoritiesService, useValue: operatorAuthoritiesService },
        { provide: AccountVerificationBodyService, useValue: accountVerificationBodyService },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
    setUser('OPERATOR', 'ENABLED');
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('for approved accounts and users with edit rights', () => {
    beforeEach(async () => {
      operatorAuthoritiesService.getAccountOperatorAuthorities.mockReturnValueOnce(of(mockOperatorListData));
    });
    beforeEach(createModule);
    beforeEach(createComponent);

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render the title', () => {
      const element: HTMLElement = fixture.nativeElement;
      const header = element.querySelector('h2[class="govuk-heading-m"]');

      expect(header).toBeTruthy();
      expect(header.innerHTML.trim()).toEqual('Users and contacts');
    });

    it('should display the same add user button regardless of role', () => {
      setUserAsRegulator();
      fixture.detectChanges();

      expect(page.addUserFormButton).toBeTruthy();
      expect(page.addUserFormButton.innerHTML.trim()).toEqual('Continue');

      setUserAsOperator();
      fixture.detectChanges();

      expect(page.addUserFormButton).toBeTruthy();
      expect(page.addUserFormButton.innerHTML.trim()).toEqual('Continue');
    });

    it('should render a learn more section', () => {
      setUserAsRegulator();
      fixture.detectChanges();
      expect(page.details).toBeTruthy();
      expect(page.detailsSummary.innerHTML.trim()).toEqual('Learn more about user types, roles and permissions');

      setUserAsOperator();
      fixture.detectChanges();
      expect(page.details).toBeTruthy();
      expect(page.detailsSummary.innerHTML.trim()).toEqual('Learn more about user types, roles and permissions');
    });

    it('should initialize with default sorting by created date', () => {
      expectUserOrderToBe([0, 2, 1, 3]);
    });

    it('should sort by name', () => {
      page.nameSortingButton.click();
      fixture.detectChanges();

      expectUserOrderToBe([3, 2, 0, 1]);

      page.nameSortingButton.click();
      fixture.detectChanges();

      expectUserOrderToBe([1, 0, 2, 3]);
    });

    it('should show locked status sign', () => {
      expect(page.locks).toHaveLength(1);
    });

    it('should render a save changes to both operator and regulator users', () => {
      setUserAsRegulator();
      fixture.detectChanges();

      expect(page.usersFormSubmitButton).toBeTruthy();
      expect(page.usersFormSubmitButton.innerHTML.trim()).toEqual('Save');

      setUserAsOperator();
      fixture.detectChanges();

      expect(page.usersFormSubmitButton).toBeTruthy();
      expect(page.usersFormSubmitButton.innerHTML.trim()).toEqual('Save');
    });

    it('should render the list of users with links to both operator and regulator users', () => {
      setUserAsRegulator();
      fixture.detectChanges();

      expect(page.nameLinks[0]).toBeTruthy();
      expect(page.nameLinks[1]).toBeTruthy();
      expect(page.nameLinks[2]).toBeTruthy();
      expect(page.nameLinks[3]).toBeTruthy();
      expect(page.roleSelectsValue[0]).toEqual('operator_admin');

      setUserAsOperator();
      fixture.detectChanges();

      expect(page.nameLinks[0]).toBeTruthy();
      expect(page.nameLinks[1]).toBeTruthy();
      expect(page.nameLinks[2]).toBeTruthy();
      expect(page.nameLinks[3]).toBeTruthy();
      expect(page.roleSelectsValue[0]).toEqual('operator_admin');
    });

    it('should show select input for advanced users but not for restricted users', () => {
      setUserAsRegulator();
      fixture.detectChanges();

      expect(page.contactTypeSelect[0]).toBeTruthy();
      expect(page.contactTypeSelect[1]).toBeFalsy();
      expect(page.contactTypeSelect[2]).toBeFalsy();
      expect(page.contactTypeSelect[3]).toBeTruthy();
    });

    it('should not accept submission without at least one active operator admin', () => {
      page.roleSelectsValue = ['operator', 'operator', 'operator', 'operator'];
      fixture.detectChanges();
      page.usersFormSubmitButton.click();
      fixture.detectChanges();

      expect(page.usersFormSubmitButton.disabled).toBeFalsy();
      expect(page.errorSummary).toBeTruthy();

      page.roleSelectsValue = ['operator_admin', 'operator_admin', 'operator_admin', 'operator_admin'];
      page.usersFormSubmitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
    });

    it('should not accept submission with restricted user as contact', () => {
      page.roleSelectsValue = ['operator', 'operator', 'operator', 'operator'];
      fixture.detectChanges();
      page.usersFormSubmitButton.click();
      fixture.detectChanges();

      expect(page.usersFormSubmitButton.disabled).toBeFalsy();
      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummary.textContent).toContain(
        'You cannot assign a Restricted user as primary contact on your account  You cannot assign a Restricted user as secondary contact on your account',
      );
    });

    it('should not accept submission without at least one active primary contact', () => {
      page.roleSelectsValue = ['operator_admin'];
      fixture.detectChanges();

      page.accountStatusSelectsValue = ['DISABLED'];
      fixture.detectChanges();

      page.usersFormSubmitButton.click();
      fixture.detectChanges();

      expect(page.usersFormSubmitButton.disabled).toBeFalsy();
      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummary.textContent).toContain('You must have a primary contact on your account');

      page.accountStatusSelectsValue = ['ACTIVE'];
      page.usersFormSubmitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
    });

    it('should not accept submission with more then one same contact type', () => {
      page.contactTypeSelectsValue = ['PRIMARY', 'PRIMARY'];
      page.usersFormSubmitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummary.textContent).toContain('Primary contact must be unique');

      page.contactTypeSelectsValue = ['SECONDARY', 'SECONDARY'];
      page.usersFormSubmitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummary.textContent).toContain('Secondary contact must be unique');
    });

    it('should display correct dropdown values in users table', () => {
      expect(Array.from(page.roleSelects[0].options).map((option) => option.textContent.trim())).toEqual(
        mockOperatorRoleCodes.slice(0, 2).map((opCode) => opCode.name),
      );
    });

    it('should only allow role edit on operator and operator admins', () => {
      expect(page.roleSelects[0]).toBeTruthy();
      expect(page.rows[1].querySelector('select[name$=".roleCode"]')).toBeFalsy();
      expect(page.rows[1].querySelectorAll('td')[1].textContent.trim()).toEqual(
        mockOperatorListData.authorities[2].roleName,
      );
    });

    it('should navigate to add operator form', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

      page.addUserFormButton.click();
      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledWith(['users/add', 'operator'], {
        relativeTo: TestBed.inject(ActivatedRoute),
      });
    });

    it('should disable the inputs of a disabled record', () => {
      expect(page.nameColumns[1].textContent.trim()).toEqual('Darth Vader');
      expect(page.rows[1].querySelector('select[name$=".roleCode"]')).toBeFalsy();
      expect(page.contactTypeSelect[1]).toBeFalsy();
      expect(page.contactTypeSelect[0]).toBeTruthy();

      page.accountStatusSelectsValue = [undefined, 'ACTIVE'];
      fixture.detectChanges();

      expect(page.roleSelects[1]).toBeTruthy();
    });

    it('should keep the changed values and form status after sort', () => {
      expect(page.nameColumns[1].textContent.trim()).toEqual('Darth Vader');

      page.accountStatusSelectsValue = [undefined, 'ACTIVE'];
      fixture.detectChanges();
      expect(page.accountStatusSelectsValue[1]).toEqual('ACTIVE');

      page.nameSortingButton.click();
      fixture.detectChanges();

      expect(page.nameColumns[1].textContent.trim()).toEqual('Darth Vader');
      expect(page.accountStatusSelectsValue[1]).toEqual('ACTIVE');

      page.nameSortingButton.click();
      fixture.detectChanges();

      expect(page.nameColumns[2].textContent.trim()).toEqual('Darth Vader');
      expect(page.accountStatusSelectsValue[2]).toEqual('ACTIVE');
    });

    it('should post only changed values on save', () => {
      changeInputValue(fixture, '#usersArray\\.3\\.roleCode', 'operator_admin');
      fixture.detectChanges();

      page.usersFormSubmitButton.click();
      fixture.detectChanges();

      expect(operatorAuthoritiesService.updateAccountOperatorAuthorities).toHaveBeenCalledWith(
        mockedOrganisationAccount.id,
        {
          accountOperatorAuthorityUpdateList: [
            { authorityStatus: 'ACTIVE', roleCode: 'operator_admin', userId: 'userTest4' },
          ],
          contactTypes: mockOperatorListData.contactTypes,
        },
      );
    });

    it('should post only changed values on save after sort', () => {
      changeInputValue(fixture, '#usersArray\\.3\\.roleCode', 'operator_admin');
      fixture.detectChanges();

      page.nameSortingButton.click();
      fixture.detectChanges();

      page.usersFormSubmitButton.click();
      fixture.detectChanges();

      expect(operatorAuthoritiesService.updateAccountOperatorAuthorities).toHaveBeenCalledWith(
        mockedOrganisationAccount.id,
        {
          accountOperatorAuthorityUpdateList: [
            { authorityStatus: 'ACTIVE', roleCode: 'operator_admin', userId: 'userTest4' },
          ],
          contactTypes: mockOperatorListData.contactTypes,
        },
      );
    });

    it('should show error summary when updating a deleted user', async () => {
      operatorAuthoritiesService.updateAccountOperatorAuthorities.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 400, error: { code: 'AUTHORITY1004' } })),
      );

      changeInputValue(fixture, '#usersArray\\.3\\.roleCode', 'operator_admin');
      fixture.detectChanges();

      page.usersFormSubmitButton.click();
      fixture.detectChanges();

      await expectBusinessErrorToBe(savePartiallyNotFoundOperatorError(mockedOrganisationAccount.id));
    });
  });

  describe('for approved accounts and users without edit rights', () => {
    beforeEach(async () => {
      const mockOperatorListDataNonEditable = { ...mockOperatorListData, editable: false };
      operatorAuthoritiesService.getAccountOperatorAuthorities.mockReturnValueOnce(of(mockOperatorListDataNonEditable));
    });
    beforeEach(createModule);
    beforeEach(createComponent);

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should not display add user button', () => {
      setUserAsRegulator();
      fixture.detectChanges();

      expect(page.addUserFormButton).toBeFalsy();

      setUserAsOperator();
      fixture.detectChanges();

      expect(page.addUserFormButton).toBeFalsy();
    });

    it('should show locked status sign', () => {
      setUserAsRegulator();
      fixture.detectChanges();
      expect(page.locks).toHaveLength(1);

      setUserAsOperator();
      fixture.detectChanges();
      expect(page.locks).toHaveLength(1);
    });

    it('should not render save changes button', () => {
      setUserAsRegulator();
      fixture.detectChanges();

      expect(page.usersFormSubmitButton).toBeFalsy();

      setUserAsOperator();
      fixture.detectChanges();

      expect(page.usersFormSubmitButton).toBeFalsy();
    });

    it('should render the list of users sorted but without links', () => {
      setUserAsRegulator();
      fixture.detectChanges();

      expectUserOrderToBe([0, 2, 1, 3]);
      page.nameLinks.forEach((lock) => expect(lock).toBeFalsy());

      setUserAsOperator();
      fixture.detectChanges();

      expectUserOrderToBe([0, 2, 1, 3]);
      page.nameLinks.forEach((lock) => expect(lock).toBeFalsy());
    });

    it('should display check marks for declaring contact types', () => {
      const checkNonEditableContacts = () => {
        expect(page.rows[0].querySelectorAll('td')[2].textContent.trim()).toEqual('Primary contact');
        expect(page.rows[3].querySelectorAll('td')[2].textContent.trim()).toEqual('Secondary contact');
        expect(page.roleSelects[0]).toBeFalsy();
        expect(page.roleSelects[2]).toBeFalsy();
      };

      setUserAsRegulator();
      fixture.detectChanges();
      checkNonEditableContacts();

      setUserAsOperator();
      fixture.detectChanges();
      checkNonEditableContacts();
    });
  });

  describe('for accounts in awaiting approval status', () => {
    let account: OrganisationAccountDTO;
    beforeEach(async () => {
      account = {
        ...mockedOrganisationAccount,
        status: 'AWAITING_APPROVAL',
      };
    });

    beforeEach(createModule);
    beforeEach(createComponent);

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should not display the add new user button when account is in awaiting approval status', () => {
      setUserAsRegulator();
      fixture.detectChanges();

      activatedRouteStub.setResolveMap({ account: cloneDeep(account) });

      fixture.detectChanges();

      expect(page.addUserFormButton).toBeFalsy();
    });
  });

  describe('for denied accounts', () => {
    let account: OrganisationAccountDTO;
    beforeEach(async () => {
      account = {
        ...mockedOrganisationAccount,
        status: 'DENIED',
      };
    });

    beforeEach(createModule);
    beforeEach(createComponent);

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should not display the add new user button when account is in denied status', () => {
      setUserAsRegulator();
      fixture.detectChanges();

      activatedRouteStub.setResolveMap({ account: cloneDeep(account) });

      fixture.detectChanges();

      expect(page.addUserFormButton).toBeFalsy();
    });
  });
});
