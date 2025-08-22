import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { initialState, OrganisationAccountStore } from '@accounts/organisation-account-application/+state';
import { mockCreateOrganisationAccountStateProvider } from '@accounts/testing/mock-create-organisation-account.state.provider';
import { mockCreateOrganisationAccountStore } from '@accounts/testing/mock-create-organisation-account.store';
import { CountyService } from '@core/services/county.service';
import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';
import { BasePage, MockType } from '@testing';

import { CountyAddressDTO } from 'esos-api';

import { OrganisationDetailsContainerComponent } from './organisation-details-container.component';

describe('OrganisationDetailsContainerComponent', () => {
  let component: OrganisationDetailsContainerComponent;
  let fixture: ComponentFixture<OrganisationDetailsContainerComponent>;
  let page: Page;
  let router: Router;
  let navigateSpy: jest.SpyInstance;

  const mockCountyService: MockType<CountyService> = {
    getUkCounties: jest.fn().mockReturnValue(
      of([
        {
          id: 1,
          name: 'West Sussex',
        },
        {
          id: 2,
          name: 'Clackmannanshire',
        },
      ]),
    ),
  };

  class Page extends BasePage<OrganisationDetailsContainerComponent> {
    set registeredName(value: string) {
      this.setInputValue('#registeredName', value);
    }

    set type(value: string) {
      this.setInputValue('#type', value);
    }

    set otherTypeName(value: string) {
      this.setInputValue('#otherTypeName', value);
    }

    set codes(codesArray: string[]) {
      codesArray.forEach((value: string, index: number) => {
        this.setInputValue(`#codes.${index}`, value);
      });
    }

    set address(value: CountyAddressDTO) {
      this.setInputValue('#addressDetails.line1', value?.line1);
      this.setInputValue('#addressDetails.line2', value?.line2);
      this.setInputValue('#addressDetails.city', value?.city);
      this.setInputValue('#addressDetails.county', value?.county);
      this.setInputValue('#addressDetails.postcode', value?.postcode);
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get errorSummaryListContents(): string[] {
      return Array.from(this.errorSummary.querySelectorAll<HTMLAnchorElement>('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }

    get addButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button.govuk-button.govuk-button--secondary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  beforeEach(async () => {
    mockCreateOrganisationAccountStore.setAddress.mockClear();
    mockCreateOrganisationAccountStore._state.next(initialState);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, OrganisationDetailsContainerComponent],
      providers: [
        { provide: OrganisationAccountStore, useValue: mockCreateOrganisationAccountStore },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockCreateOrganisationAccountStateProvider },
        { provide: CountyService, useValue: mockCountyService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationDetailsContainerComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on submit', () => {
    it('should navigate to location and update store', () => {
      page.registeredName = 'New name';
      page.type = 'OTHER';

      page.addButton.click();
      page.addButton.click();
      fixture.detectChanges();

      page.otherTypeName = 'some classification name';
      page.codes = ['CodeA', 'CodeB', 'CodeC'];
      page.address = {
        line1: '123 Main St',
        line2: 'Apt 4',
        city: 'Anytown',
        county: 'West Sussex',
        postcode: '12345',
      };

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();

      expect(mockCreateOrganisationAccountStore.setRegisteredName).toHaveBeenCalledWith('New name');
      expect(mockCreateOrganisationAccountStore.setType).toHaveBeenCalledWith('OTHER');
      expect(mockCreateOrganisationAccountStore.setOtherTypeName).toHaveBeenCalledWith('some classification name');
      expect(mockCreateOrganisationAccountStore.setCodes).toHaveBeenCalledWith(['CodeA', 'CodeB', 'CodeC']);
      expect(mockCreateOrganisationAccountStore.setAddress).toHaveBeenCalledWith({
        line1: '123 Main St',
        line2: 'Apt 4',
        city: 'Anytown',
        county: 'West Sussex',
        postcode: '12345',
      });
      expect(navigateSpy).toHaveBeenCalledWith(['../location'], expect.anything());
    });
  });
});
