import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  mockAuthorityService,
  mockKeycloakService,
  mockTermsAndConditionsService,
  mockUsersService,
} from '@core/guards/mocks';
import { AuthStore } from '@core/store/auth';
import { SharedModule } from '@shared/shared.module';
import { BasePage } from '@testing';
import { KeycloakService } from 'keycloak-angular';

import { GovukComponentsModule } from 'govuk-components';

import { AuthoritiesService, TermsAndConditionsService, UsersService, UserStateDTO } from 'esos-api';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let authStore: AuthStore;
  let page: Page;

  class Page extends BasePage<LandingPageComponent> {
    get notLoggedInLandingPageLinks() {
      return this.queryAll<HTMLAnchorElement>('.govuk-button--start');
    }

    get organisationLink() {
      return this.query<HTMLAnchorElement>('a[href="/accounts/new"]');
    }

    get pageHeadingContent() {
      return this.query<HTMLElement>('esos-page-heading').textContent.trim();
    }

    get paragraphContents() {
      return this.queryAll<HTMLElement>('p').map((item) => item.textContent.trim());
    }
  }

  const setUser = (roleType: UserStateDTO['roleType'], loginStatuses: UserStateDTO['status']) => {
    authStore.setUserState({ roleType, status: loginStatuses });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukComponentsModule, SharedModule, RouterTestingModule, LandingPageComponent],
      providers: [
        { provide: KeycloakService, useValue: mockKeycloakService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthoritiesService, useValue: mockAuthorityService },
        { provide: TermsAndConditionsService, useValue: mockTermsAndConditionsService },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setIsLoggedIn(false);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the landing page buttons if not logged in', () => {
    expect(page.organisationLink).toBeFalsy();
    expect(page.notLoggedInLandingPageLinks).toHaveLength(1);
  });

  it('should only display installation application button to operators', () => {
    expect(page.organisationLink).toBeFalsy();
    expect(page.notLoggedInLandingPageLinks).toHaveLength(1);

    authStore.setIsLoggedIn(true);
    setUser('OPERATOR', 'NO_AUTHORITY');

    expect(page.organisationLink).toBeTruthy();

    setUser('OPERATOR', 'DISABLED');

    expect(page.organisationLink).toBeTruthy();

    setUser('REGULATOR', 'DISABLED');

    expect(page.organisationLink).toBeFalsy();
  });

  it(`should show disabled message when role='REGULATOR' and status 'DISABLED'`, () => {
    authStore.setIsLoggedIn(true);
    setUser('REGULATOR', 'DISABLED');
    expect(page.pageHeadingContent).toEqual(
      'Your user account has been disabled. Please contact your admin to gain access to your account.',
    );
  });

  it(`should show ACCEPTED message when user login status is 'ACCEPTED'`, () => {
    authStore.setIsLoggedIn(true);
    setUser('OPERATOR', 'ACCEPTED');
    expect(page.pageHeadingContent).toEqual('Your user account needs to be activated.');
    expect(page.paragraphContents).toEqual([
      'Your user account must be activated before you can sign in to the Manage your Energy Savings Opportunity Scheme reporting service.',
      "If your account was created by your regulator, they will now activate your account. You'll receive an email once your account has been activated. Contact your regulator if your account has not been activated after 2 working days.",
    ]);
  });
});
