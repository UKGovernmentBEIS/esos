import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject } from 'rxjs';

import { BREADCRUMB_ITEMS, BreadcrumbItem } from '@core/navigation/breadcrumbs';
import { AuthStore } from '@core/store/auth';
import { SharedModule } from '@shared/shared.module';
import { BasePage } from '@testing';
import { KeycloakService } from 'keycloak-angular';

import { UserStateDTO } from 'esos-api';

import { AppComponent } from './app.component';
import { TimeoutModule } from './timeout/timeout.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let page: Page;
  let breadcrumbItem$: BehaviorSubject<BreadcrumbItem[]>;
  let authStore: AuthStore;

  const setUser: (roleType: UserStateDTO['roleType'], loginStatus?: UserStateDTO['status']) => void = (
    roleType,
    loginStatus?,
  ) => {
    authStore.setUserState({
      ...authStore.getState().userState,
      status: loginStatus,
      roleType,
    });

    fixture.detectChanges();
  };

  class Page extends BasePage<AppComponent> {
    get footer() {
      return this.query<HTMLElement>('.govuk-footer');
    }

    get dashboardLink() {
      return this.query<HTMLAnchorElement>('a[href="/dashboard"]');
    }

    get regulatorsLink() {
      return this.query<HTMLAnchorElement>('a[href="/user/regulators"]');
    }

    get accountsLink() {
      return this.query<HTMLAnchorElement>('a[href="/accounts"]');
    }

    get templatesLink() {
      return this.query<HTMLAnchorElement>('a[href="/templates"]');
    }

    get navList() {
      return this.query<HTMLDivElement>('govuk-header-nav-list');
    }

    get breadcrumbs() {
      return this.queryAll<HTMLLIElement>('.govuk-breadcrumbs__list-item');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, TimeoutModule],
      declarations: [AppComponent],
      providers: [KeycloakService],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setIsLoggedIn(true);
    authStore.setUserState({ roleType: 'OPERATOR', status: 'NO_AUTHORITY' });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    breadcrumbItem$ = TestBed.inject(BREADCRUMB_ITEMS);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the footer', () => {
    expect(page.footer).toBeTruthy();
  });

  it('should not render the dashboard link for disabled users or an operator with no authority', () => {
    setUser('OPERATOR', 'NO_AUTHORITY');

    expect(page.dashboardLink).toBeFalsy();

    setUser('OPERATOR', 'ENABLED');

    expect(page.dashboardLink).toBeTruthy();

    setUser('REGULATOR', 'ENABLED');

    expect(page.dashboardLink).toBeTruthy();

    setUser('REGULATOR', 'DISABLED');

    expect(page.dashboardLink).toBeFalsy();
  });

  it('should render the regulators link only if the user is regulator', () => {
    setUser('OPERATOR', 'NO_AUTHORITY');

    expect(page.regulatorsLink).toBeFalsy();

    setUser('REGULATOR');

    expect(page.regulatorsLink).toBeTruthy();
  });

  it('should render the accounts link only if the user is regulator, verifier or authorized operator', () => {
    setUser('OPERATOR', 'NO_AUTHORITY');

    expect(page.accountsLink).toBeFalsy();

    setUser('REGULATOR');

    expect(page.accountsLink).toBeTruthy();

    setUser('OPERATOR', 'ENABLED');

    expect(page.accountsLink).toBeTruthy();
  });

  // it('should render the templates link only if the user is a regulator', () => {
  //   setUser('OPERATOR');

  //   expect(page.templatesLink).toBeFalsy();

  //   setUser('VERIFIER');

  //   expect(page.templatesLink).toBeFalsy();

  //   setUser('REGULATOR');

  //   expect(page.templatesLink).toBeTruthy();
  // });

  it('should not render the nav list if user is disabled', () => {
    setUser('REGULATOR', 'ENABLED');
    expect(page.navList).toBeTruthy();

    setUser('REGULATOR', 'DISABLED');
    fixture.detectChanges();

    expect(page.navList).toBeFalsy();

    setUser('VERIFIER', 'TEMP_DISABLED');
    fixture.detectChanges();

    expect(page.navList).toBeFalsy();
  });

  it('should not render the nav list if user is not logged in', () => {
    authStore.setIsLoggedIn(false);
    setUser('OPERATOR', 'NO_AUTHORITY');

    expect(page.navList).toBeFalsy();

    authStore.setIsLoggedIn(true);
    setUser('OPERATOR', 'ENABLED');

    expect(page.navList).toBeTruthy();

    authStore.setIsLoggedIn(false);
    fixture.detectChanges();

    expect(page.navList).toBeFalsy();
  });

  it('should display breadcrumbs', () => {
    expect(page.breadcrumbs).toEqual([]);

    breadcrumbItem$.next([{ text: 'Dashboard', link: ['/dashboard'] }, { text: 'Apply for a GHGE permit' }]);
    fixture.detectChanges();

    expect(Array.from(page.breadcrumbs).map((breadcrumb) => breadcrumb.textContent)).toEqual([
      'Dashboard',
      'Apply for a GHGE permit',
    ]);

    expect(page.breadcrumbs[0].querySelector<HTMLAnchorElement>('a').href).toContain('/dashboard');
    expect(page.breadcrumbs[1].querySelector<HTMLAnchorElement>('a')).toBeFalsy();

    breadcrumbItem$.next(null);
    fixture.detectChanges();

    expect(page.breadcrumbs).toEqual([]);
  });
});
