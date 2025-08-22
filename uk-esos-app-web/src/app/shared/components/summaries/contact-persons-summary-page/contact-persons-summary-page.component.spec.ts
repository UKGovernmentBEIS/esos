import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ContactPersonsSummaryPageComponent } from '@shared/components/summaries';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('ContactPersonsSummaryPageComponent', () => {
  let component: ContactPersonsSummaryPageComponent;
  let fixture: ComponentFixture<ContactPersonsSummaryPageComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<ContactPersonsSummaryPageComponent> {
    get headers() {
      return this.queryAll<HTMLHeadElement>('h2').map((el) => el?.textContent?.trim());
    }
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactPersonsSummaryPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });

    fixture = TestBed.createComponent(ContactPersonsSummaryPageComponent);
    component = fixture.componentInstance;

    component.changeLink = {
      TOTAL_ENERGY: 'link',
    };
    component.data = {
      primaryContact: {
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Job title',
        email: 'email1@email',
        phoneNumber: { countryCode: '44', number: '1234567890' },
        mobileNumber: { countryCode: undefined, number: undefined },
        line1: 'Line',
        line2: null,
        city: 'City',
        county: 'County',
        postcode: 'Postcode',
      },
      hasSecondaryContact: true,
      secondaryContact: {
        firstName: 'Jane',
        lastName: 'Doe',
        jobTitle: 'Job title',
        email: 'email2@email',
        phoneNumber: { countryCode: '44', number: '1234567890' },
        mobileNumber: { countryCode: undefined, number: undefined },
        line1: 'Line',
        line2: null,
        city: 'City',
        county: 'County',
        postcode: 'Postcode',
      },
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the headers', () => {
    expect(page.headers).toEqual([
      'Primary contact details',
      'Do you want to add a secondary contact?',
      'Secondary contact details',
    ]);
  });

  it('should display the table with added persons', () => {
    expect(page.summaryListValues).toEqual([
      ['First name', 'John'],
      ['Last name', 'Doe'],
      ['Job title', 'Job title'],
      ['Email address', 'email1@email'],
      ['Address', 'Line'],
      ['Town or city', 'City'],
      ['County', 'County'],
      ['Postcode', 'Postcode'],
      ['Phone number 1', 'UK (44) 1234567890'],
      ['Phone number 2', ''],
      ['First name', 'Jane'],
      ['Last name', 'Doe'],
      ['Job title', 'Job title'],
      ['Email address', 'email2@email'],
      ['Address', 'Line'],
      ['Town or city', 'City'],
      ['County', 'County'],
      ['Postcode', 'Postcode'],
      ['Phone number 1', 'UK (44) 1234567890'],
      ['Phone number 2', ''],
    ]);
  });
});
