import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { organisationAccountsCsvMap } from '@accounts/upload-organisation-accounts/upload-organisation-accounts.map';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';
import Papa from 'papaparse';

import { OrganisationAccountOnboardingRegistriesService } from 'esos-api';

import { UploadOrganisationAccountsComponent } from './upload-organisation-accounts.component';

const mockExistingVerifiedRegistrationNumbers = ['EX111111', 'EX222222'];
const mockExistingVerifiedEmails = ['1@existing.com', '2@existing.com'];

const mockSuccessPapaResult = {
  data: [
    {
      CRN: 'AA111111',
      Email: '1@r.com',
    },
  ],
  errors: [],
  meta: {
    fields: Object.values(organisationAccountsCsvMap),
  },
} as Papa.ParseResult<any>;

const mockErrorPapaResult = {
  data: [
    {
      CRN: 'test',
      Email: 'test',
    },
    {
      CRN: 'DU111111',
      Email: '1@duplicated.com',
    },
    {
      CRN: 'DU111111',
      Email: '1@duplicated.com',
    },
  ],
  errors: [],
  meta: {
    fields: Object.values(organisationAccountsCsvMap),
  },
} as Papa.ParseResult<any>;

describe('UploadOrganisationAccountsComponent', () => {
  let component: UploadOrganisationAccountsComponent;
  let fixture: ComponentFixture<UploadOrganisationAccountsComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();
  const registriesService: MockType<OrganisationAccountOnboardingRegistriesService> = {
    addOrganisationAccountOnboardingRegistries: jest.fn().mockReturnValue(of(mockSuccessPapaResult.data)),
    getExistingVerifiedRegistrationNumbers: jest.fn().mockReturnValue(of(mockExistingVerifiedRegistrationNumbers)),
    getExistingVerifiedEmails: jest.fn().mockReturnValue(of(mockExistingVerifiedEmails)),
  };

  class Page extends BasePage<UploadOrganisationAccountsComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get paragraphs(): HTMLParagraphElement[] {
      return this.queryAll<HTMLParagraphElement>('p.govuk-body');
    }

    get errorSummaryListContents(): string[] {
      return Array.from(this.errorSummary.querySelectorAll<HTMLAnchorElement>('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get errorTitles() {
      return this.queryAll<HTMLParagraphElement>('.govuk-error-summary__list li p');
    }

    get uploadFileButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button.govuk-button--secondary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: OrganisationAccountOnboardingRegistriesService, useValue: registriesService },
        DestroySubject,
        PendingRequestService,
      ],
    });
    fixture = TestBed.createComponent(UploadOrganisationAccountsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements and form with 0 errors', () => {
    expect(page.errorSummary).toBeFalsy();
    expect(page.heading1).toBeTruthy();
    expect(page.heading1.textContent.trim()).toEqual('Upload a file with verified organisation accounts');
    expect(page.paragraphs).toHaveLength(3);
    expect(page.uploadFileButton).toBeTruthy();
    expect(page.submitButton).toBeFalsy();
  });

  it('should display CSV field errors', () => {
    component['processCSVData'](mockErrorPapaResult);
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errorTitles.map((item) => item.textContent.trim())).toEqual([
      "The field 'CRN' must be either 8 digits, 1 letter followed by 7 digits, 2 letters followed by 6 digits or 2 letters followed by 5 digits followed by a final letter. If your Company Registration Number has less than 8 digits then you may need to add zeros at the beginning",
      "Check the data in column 'CRN' on rows 1",
      'There are duplicated registration numbers in the file',
      "Check the data in column 'CRN' on rows 2, 3",
      'Enter an email address in the correct format, like name@example.com',
      "Check the data in column 'Email' on rows 1",
      'There are duplicated user emails in the file',
      "Check the data in column 'Email' on rows 2, 3",
    ]);
  });

  it('should not display any error when CSV is valid and submit a valid form', () => {
    const registriesServiceSpy = jest.spyOn(registriesService, 'addOrganisationAccountOnboardingRegistries');
    expect(page.errorSummary).toBeFalsy();

    component['processCSVData'](mockSuccessPapaResult);
    fixture.detectChanges();
    expect(page.errorSummary).toBeFalsy();

    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeFalsy();
    expect(registriesServiceSpy).toHaveBeenCalledWith([{ email: '1@r.com', registrationNumber: 'AA111111' }]);
  });
});
