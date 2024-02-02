import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '@core/services/auth.service';
import { CountryService } from '@core/services/country.service';
import { AuthStore } from '@core/store/auth';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, BasePage, CountryServiceStub } from '@testing';

import { UserStateDTO } from 'esos-api';

import { SharedUserModule } from '../../shared-user/shared-user.module';
import { mockedOrganisationAccountPayload } from '../testing/mock-data';
import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let page: Page;
  let authStore: AuthStore;
  let authService: Partial<jest.Mocked<AuthService>>;
  let activatedRouteStub: ActivatedRouteStub;

  class Page extends BasePage<DetailsComponent> {
    get heading() {
      return this.queryAll<HTMLHeadingElement>('h2');
    }

    get accountDetails() {
      return this.queryAll<HTMLElement>('dl dd:not(.govuk-summary-list__actions)');
    }

    get actions() {
      return this.queryAll<HTMLElement>('dl dd.govuk-summary-list__actions');
    }
  }

  const createModule = async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, SharedUserModule, GovukDatePipe, DetailsComponent],
      providers: [
        { provide: CountryService, useClass: CountryServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    component.currentTab = 'details';
    page = new Page(fixture);
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    activatedRouteStub = new ActivatedRouteStub(undefined, undefined, {
      data: { ...mockedOrganisationAccountPayload, registrationStatus: true },
    });

    authService = {
      loadUserState: jest.fn(),
    };
  });
  describe('account details for operators', () => {
    beforeEach(createModule);
    beforeEach(() => setUser('OPERATOR'));
    beforeEach(createComponent);

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render the headings', () => {
      expect(page.heading.map((el) => el.textContent.trim())).toEqual(['Organisation details']);
    });

    it('should render the account details', () => {
      expect(page.accountDetails.map((dd) => dd.textContent.trim())).toEqual([
        'Yes',
        'Registration number',
        'Organisation name',
        'Line 1',
        'City',
        'Aberdeenshire',
        'Post code',
        'England',
      ]);
    });

    it('should not render the edit links', () => {
      expect(Array.from(page.actions).filter((action) => action.textContent.trim() === 'Change').length).toEqual(0);
    });
  });

  describe('account details for regulators', () => {
    beforeEach(createModule);
    beforeEach(() => setUser('REGULATOR'));
    beforeEach(createComponent);

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render the headings', () => {
      expect(page.heading.map((el) => el.textContent.trim())).toEqual(['Organisation details']);
    });

    it('should render the account details', () => {
      expect(page.accountDetails.map((dd) => dd.textContent.trim())).toEqual([
        'Yes',
        'Registration number',
        'Organisation name',
        'Line 1',
        'City',
        'Aberdeenshire',
        'Post code',
        'England',
      ]);
    });

    it('should not render the edit links', () => {
      expect(Array.from(page.actions).filter((action) => action.textContent.trim() === 'Change').length).toEqual(0);
    });
  });

  function setUser(role: UserStateDTO['roleType']) {
    authStore.setUserState({
      ...authStore.getState().userState,
      status: 'ENABLED',
      roleType: role,
      userId: role === 'REGULATOR' ? 'regUserId' : 'opTestId',
    });
  }
});
