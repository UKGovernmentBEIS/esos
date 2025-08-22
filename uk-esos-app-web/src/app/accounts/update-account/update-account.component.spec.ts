import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { mockedOrganisationAccount } from '@accounts/testing/mock-data';
import { mockUpdateOrganisationAccountStateProvider } from '@accounts/testing/mock-update-organisation-account.state.provider';
import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';
import { ActivatedRouteStub, BasePage } from '@testing';

import { OrganisationAccountUpdateService } from 'esos-api';

import { AccountsStore } from '..';
import { UpdateAccountComponent } from './update-account.component';

describe('UpdateAccountComponent', () => {
  let component: UpdateAccountComponent;
  let fixture: ComponentFixture<UpdateAccountComponent>;
  let page: Page;
  let organisationAccountUpdateService: OrganisationAccountUpdateService;

  const activatedRoute = new ActivatedRouteStub({ accountId: '1' });

  class Page extends BasePage<UpdateAccountComponent> {
    set registeredName(value: string) {
      this.setInputValue('#registeredName', value);
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UpdateAccountComponent],
      providers: [
        AccountsStore,
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockUpdateOrganisationAccountStateProvider },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });

    organisationAccountUpdateService = TestBed.inject(OrganisationAccountUpdateService);
    fixture = TestBed.createComponent(UpdateAccountComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form and navigate to account page on details tab', () => {
    const { competentAuthority, id, organisationId, registrationNumber, status, ...otherMockedOrganisationAccount } =
      mockedOrganisationAccount;
    const organisationAccountUpdateServiceSpy = jest
      .spyOn(organisationAccountUpdateService, 'updateOrganisationAccount')
      .mockReturnValue(of(null));
    page.registeredName = 'New name';

    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeFalsy();

    expect(organisationAccountUpdateServiceSpy).toHaveBeenCalledWith(1, {
      ...otherMockedOrganisationAccount,
      line2: null,
      name: 'New name',
    });
  });
});
