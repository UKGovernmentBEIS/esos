import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';
import { HouseCompanyDetailsService } from '@shared/services/house-company-details-service/house-company-details.service';
import { BasePage, mockClass, MockType } from '@testing';

import { CompanyProfileDTO, OrganisationAccountsService } from 'esos-api';

import { mockCreateOrganisationAccountStateProvider } from '../../../testing/mock-create-organisation-account.state.provider';
import { mockCreateOrganisationAccountStore } from '../../../testing/mock-create-organisation-account.store';
import { initialState, OrganisationAccountStore } from '../../+state';
import { OrganisationCompaniesHouseContainerComponent } from './organisation-companies-house-container.component';

describe('OrganisationCompaniesHouseContainerComponent', () => {
  let component: OrganisationCompaniesHouseContainerComponent;
  let fixture: ComponentFixture<OrganisationCompaniesHouseContainerComponent>;
  let page: Page;
  let router: Router;
  let navigateSpy: jest.SpyInstance;
  let houseCompanyDetailsService: MockType<HouseCompanyDetailsService>;
  let organisationAccountsService: MockType<OrganisationAccountsService>;

  class Page extends BasePage<OrganisationCompaniesHouseContainerComponent> {
    get registrationNumberExistRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="registrationNumberExist"]');
    }

    set registrationNumber(value: string) {
      this.setInputValue('#registrationNumber', value);
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }
    get errorSummaryListContents(): string[] {
      return Array.from(this.errorSummary.querySelectorAll<HTMLAnchorElement>('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }
    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  beforeEach(async () => {
    mockCreateOrganisationAccountStore.setRegistrationStatus.mockClear();
    mockCreateOrganisationAccountStore.setRegistrationNumber.mockClear();
    mockCreateOrganisationAccountStore._state.next(initialState);

    houseCompanyDetailsService = mockClass(HouseCompanyDetailsService);
    houseCompanyDetailsService.getCompanyProfile.mockReturnValue(
      of({
        name: 'SANDBOX LIMITED',
        registrationNumber: '08898911',
        address: {
          line1: '60 The Grove',
          line2: 'Palmers Green',
          city: 'London',
          postcode: 'N13 5JR',
        },
        sicCodes: ['62090'],
      } as CompanyProfileDTO),
    );
    houseCompanyDetailsService.checkCompanyReferenceNumber.mockReturnValue(of(null));

    organisationAccountsService = mockClass(OrganisationAccountsService);
    organisationAccountsService.isExistingAccountRegistrationNumber.mockReturnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, OrganisationCompaniesHouseContainerComponent],
      providers: [
        { provide: OrganisationAccountStore, useValue: mockCreateOrganisationAccountStore },
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockCreateOrganisationAccountStateProvider },
        { provide: HouseCompanyDetailsService, useValue: houseCompanyDetailsService },
        { provide: OrganisationAccountsService, useValue: organisationAccountsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationCompaniesHouseContainerComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should navigate to name and update store on valid and dirty form', () => {
      page.registrationNumberExistRadios[0].click();
      page.registrationNumber = '08898911';

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(mockCreateOrganisationAccountStore.setRegistrationStatus).toHaveBeenCalledWith(true);
      expect(mockCreateOrganisationAccountStore.setRegistrationNumber).toHaveBeenCalledWith('08898911');
      expect(mockCreateOrganisationAccountStore.setRegisteredName).toHaveBeenCalledWith('SANDBOX LIMITED');
      expect(mockCreateOrganisationAccountStore.setAddress).toHaveBeenCalledWith({
        line1: '60 The Grove',
        line2: 'Palmers Green',
        city: 'London',
        county: null,
        postcode: 'N13 5JR',
      });
      expect(mockCreateOrganisationAccountStore.setType).toHaveBeenCalledWith('SIC');
      expect(mockCreateOrganisationAccountStore.setCodes).toHaveBeenCalledWith(['62090']);

      expect(navigateSpy).toHaveBeenCalledWith(['details'], expect.anything());
    });

    it('should navigate to name and update store on valid and dirty form without registration number', () => {
      page.registrationNumberExistRadios[1].click();

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(mockCreateOrganisationAccountStore.setRegistrationStatus).toHaveBeenCalledWith(false);
      expect(mockCreateOrganisationAccountStore.setRegistrationNumber).toHaveBeenCalledWith(null);
      expect(mockCreateOrganisationAccountStore.setRegisteredName).not.toHaveBeenCalled();
      expect(mockCreateOrganisationAccountStore.setAddress).not.toHaveBeenCalled();
      expect(mockCreateOrganisationAccountStore.setType).not.toHaveBeenCalled();
      expect(mockCreateOrganisationAccountStore.setCodes).not.toHaveBeenCalled();

      expect(navigateSpy).toHaveBeenCalledWith(['details'], expect.anything());
    });
  });
});
