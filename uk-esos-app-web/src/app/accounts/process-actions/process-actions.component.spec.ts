import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { mockedOrganisationAccount } from '@accounts/testing/mock-data';
import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store/auth';
import { ActivatedRouteStub, BasePage, mockClass, MockType } from '@testing';

import {
  RequestActionDTO,
  RequestCreateActionProcessResponseDTO,
  RequestCreateValidationResult,
  RequestsService,
  UserStateDTO,
} from 'esos-api';

import { ProcessActionsComponent } from './process-actions.component';
import { ProcessActionsService } from './process-actions.service';

describe('ProcessActionsComponent', () => {
  let component: ProcessActionsComponent;
  let fixture: ComponentFixture<ProcessActionsComponent>;
  let authStore: AuthStore;
  let page: Page;

  const activatedRouteStub = new ActivatedRouteStub(undefined, undefined, {
    account: mockedOrganisationAccount,
  });
  const accountId = 0;
  const processRequestCreateActionResponse: RequestCreateActionProcessResponseDTO = { requestId: '1234' };
  const requestService = mockClass(RequestsService);

  const authService: MockType<AuthService> = {
    loadUserState: jest.fn(),
  };

  const processActionsService: MockType<ProcessActionsService> = {
    processRequestCreateAction: jest.fn(),
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(ProcessActionsComponent);
    component = fixture.componentInstance;
    component.accountId$ = of(accountId.toString());
    page = new Page(fixture);
    fixture.detectChanges();
  };

  const createModule = async (
    roleType: UserStateDTO['roleType'],
    mockedWorkflows?: Partial<Record<RequestActionDTO['requestType'], RequestCreateValidationResult>>,
  ) => {
    requestService.processRequestCreateAction.mockReturnValue(of(processRequestCreateActionResponse));
    requestService.getAvailableAccountWorkflows.mockReturnValue(of(mockedWorkflows ?? {}));
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: RequestsService, useValue: requestService },
        { provide: AuthService, useValue: authService },
        { provide: ProcessActionsService, useValue: processActionsService },
      ],
    }).compileComponents();
    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({
      ...authStore.getState().userState,
      roleType,
      userId: 'opTestId',
      status: 'ENABLED',
    });
    createComponent();
  };

  const testProcessRequestCreateAction = async (expectedRequestType: RequestActionDTO['requestType']) => {
    await createModule('OPERATOR', { [expectedRequestType]: { valid: true } });

    const onRequestButtonClickSpy = jest.spyOn(component, 'onRequestButtonClick');

    page.buttons[0].click();
    fixture.detectChanges();

    expect(onRequestButtonClickSpy).toHaveBeenCalledTimes(1);
    expect(onRequestButtonClickSpy).toHaveBeenCalledWith(expectedRequestType, accountId);
  };

  class Page extends BasePage<ProcessActionsComponent> {
    get buttons() {
      return this.queryAll<HTMLButtonElement>('button');
    }

    get buttonContents(): string[] {
      return this.buttons.map((item) => item.textContent.trim());
    }

    get noAvailableTaskContents(): string[] {
      return this.queryAll<HTMLLIElement>('.process-actions-error-list > li').map((item) => item.textContent.trim());
    }

    get availableTaskTitles(): string[] {
      return this.queryAll<HTMLLIElement>('.govuk-grid-column-full > h2.govuk-heading-m').map((item) =>
        item.textContent.trim(),
      );
    }

    get errorListContents(): string[] {
      return this.queryAll<HTMLLIElement>('.govuk-grid-column-full > .govuk-list > li').map((item) =>
        item.textContent.trim(),
      );
    }
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('for operator', () => {
    it('should create', async () => {
      await createModule('OPERATOR');
      expect(component).toBeTruthy();
    });

    it('should retrieve available workflows and display them as expected', async () => {
      await createModule('OPERATOR', {
        ACTION_PLAN_P3: { valid: true },
        NOTIFICATION_OF_COMPLIANCE_P3: { valid: true },
        PROGRESS_UPDATE_1_P3: { valid: true },
      });

      expect(page.availableTaskTitles).toEqual([
        'Phase 3 Notification',
        'Phase 3 Action Plan',
        'Phase 3 Progress Update 1',
      ]);
      expect(page.buttonContents).toEqual(['Start', 'Start', 'Start']);
      expect(page.errorListContents).toEqual([]);
    });

    it('should retrieve available workflows and display error that the workflow cannot be started', async () => {
      await createModule('OPERATOR', {
        ACTION_PLAN_P3: { valid: false },
        NOTIFICATION_OF_COMPLIANCE_P3: { valid: false },
        PROGRESS_UPDATE_1_P3: { valid: false },
      });

      expect(page.buttonContents).toEqual([]);
      expect(page.errorListContents).toEqual([
        'You cannot start the Notification of Compliance.',
        'You cannot start the Action Plan.',
        'You cannot start the Progress Update 1.',
      ]);
    });

    it('should retrieve available workflows and display error when another process is in progress', async () => {
      await createModule('OPERATOR', {
        ACTION_PLAN_P3: { valid: false, requests: ['ACTION_PLAN_P3'] },
        NOTIFICATION_OF_COMPLIANCE_P3: { valid: false, requests: ['ACTION_PLAN_P3'] },
        PROGRESS_UPDATE_1_P3: { valid: false, requests: ['ACTION_PLAN_P3'] },
      });

      expect(page.buttonContents).toEqual([]);
      expect(page.errorListContents).toEqual([
        "You cannot start the Notification of Compliance if you haven't submitted the Action Plan.",
        'You cannot start the Action Plan process as it is already in progress or has been completed.',
        "You cannot start the Progress Update 1 if you haven't submitted the Action Plan.",
      ]);
    });

    it('should retrieve available workflows and display message when no tasks are available', async () => {
      await createModule('OPERATOR');

      expect(page.buttonContents).toEqual([]);
      expect(page.noAvailableTaskContents).toEqual(['There are no available processes to initiate.']);
    });

    it('should retrieve available workflows and display message account is not ENABLED', async () => {
      await createModule('OPERATOR', {
        ACTION_PLAN_P3: { accountStatus: 'AWAITING_APPROVAL' } as RequestCreateValidationResult,
        NOTIFICATION_OF_COMPLIANCE_P3: { accountStatus: 'AWAITING_APPROVAL' } as RequestCreateValidationResult,
        PROGRESS_UPDATE_1_P3: { accountStatus: 'AWAITING_APPROVAL' } as RequestCreateValidationResult,
      });

      const listElementLength = page.noAvailableTaskContents.length;
      expect(page.buttonContents).toEqual([]);
      expect(page.noAvailableTaskContents[listElementLength - 3]).toEqual(
        'You cannot start the Notification of Compliance while the account status is AWAITING APPROVAL.',
      );
      expect(page.noAvailableTaskContents[listElementLength - 2]).toEqual(
        'You cannot start the Action Plan while the account status is AWAITING APPROVAL.',
      );
      expect(page.noAvailableTaskContents[listElementLength - 1]).toEqual(
        'You cannot start the Progress Update 1 while the account status is AWAITING APPROVAL.',
      );
    });

    it('should processRequestCreateAction for NOC', async () => {
      await testProcessRequestCreateAction('NOTIFICATION_OF_COMPLIANCE_P3');
    });

    it('should processRequestCreateAction for Action Plan', async () => {
      await testProcessRequestCreateAction('ACTION_PLAN_P3');
    });

    it('should processRequestCreateAction for Progress Update 1', async () => {
      await testProcessRequestCreateAction('PROGRESS_UPDATE_1_P3');
    });
  });

  describe('for regulator', () => {
    it('should create', async () => {
      await createModule('REGULATOR');
      expect(component).toBeTruthy();
    });

    it('should retrieve available workflows and display them as expected', async () => {
      await createModule('REGULATOR', { ACCOUNT_CLOSURE: { valid: true } });

      expect(page.availableTaskTitles).toEqual(['Account closure']);
      expect(page.buttonContents).toEqual(['Start account closure']);
      expect(page.errorListContents).toEqual([]);
    });

    it('should retrieve available workflows and display error when another process is in progress', async () => {
      await createModule('REGULATOR', {
        ACCOUNT_CLOSURE: {
          valid: false,
          requests: ['ACCOUNT_CLOSURE'],
        },
      });

      expect(page.buttonContents).toEqual([]);
      expect(page.errorListContents).toEqual([
        'You cannot start the Account closure process as it is already in progress or has been completed.',
      ]);
    });

    it('should retrieve available workflows and display message when no tasks are available', async () => {
      await createModule('REGULATOR');

      expect(page.buttonContents).toEqual([]);
      expect(page.noAvailableTaskContents).toEqual(['There are no available processes to initiate.']);
    });

    it('should retrieve available workflows and display message account is not ENABLED', async () => {
      await createModule('REGULATOR', {
        ACCOUNT_CLOSURE: { accountStatus: 'AWAITING_APPROVAL' } as RequestCreateValidationResult,
      });

      const listElementLength = page.noAvailableTaskContents.length;
      expect(page.buttonContents).toEqual([]);
      expect(page.noAvailableTaskContents[listElementLength - 1]).toEqual(
        'You cannot start the Account closure while the account status is AWAITING APPROVAL.',
      );
    });

    it('should processRequestCreateAction for ACCOUNT_CLOSURE', async () => {
      const expectedRequestType = 'ACCOUNT_CLOSURE';
      await createModule('REGULATOR', { ACCOUNT_CLOSURE: { valid: true } });

      const onRequestButtonClickSpy = jest.spyOn(component, 'onRequestButtonClick');

      page.buttons[0].click();
      fixture.detectChanges();

      expect(onRequestButtonClickSpy).toHaveBeenCalledTimes(1);
      expect(onRequestButtonClickSpy).toHaveBeenCalledWith(expectedRequestType, accountId);
    });
  });
});
