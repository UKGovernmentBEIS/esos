import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ResponsibleUndertakingSummaryPageComponent } from '@shared/components/summaries';
import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('ResponsibleUndertakingSummaryPageComponent', () => {
  let component: ResponsibleUndertakingSummaryPageComponent;
  let fixture: ComponentFixture<ResponsibleUndertakingSummaryPageComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<ResponsibleUndertakingSummaryPageComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });
    fixture = TestBed.createComponent(ResponsibleUndertakingSummaryPageComponent);
    component = fixture.componentInstance;
    component.isEditable = true;
    component.responsibleUndertaking = {
      organisationDetails: {
        registrationNumberExist: true,
        name: 'Corporate Legal Entity Account 2',
        type: 'OTHER',
        otherTypeName: 'some classification name',
        codes: ['CodeA', 'CodeB', 'CodeC'],
        registrationNumber: 'AB123456',
        line1: 'Some address 1',
        line2: 'Some address 2',
        city: 'London',
        county: 'London',
        postcode: '511111',
      },
      tradingDetails: {
        exist: true,
        tradingName: 'Trading name',
      },
      organisationContactDetails: {
        email: '1@o.com',
        phoneNumber: {
          countryCode: '44',
          number: '02071234567',
        },
      },
      isBehalfOfTrust: false,
      hasOverseasParentDetails: true,
      overseasParentDetails: {
        name: 'Parent company name',
        tradingName: 'Parent company trading name',
      },
    };
    component.wizardStep = {};
    component.responsibleUndertakingMap = responsibleUndertakingMap;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summaries).toEqual([
      'Does this organisation have a registration number?',
      'Yes',
      'Change',
      'Registration number',
      'AB123456',
      'Change',
      'Organisation name',
      'Corporate Legal Entity Account 2',
      'Change',
      'Activity codes',
      'Classification type: Other  Classification name: some classification name  Codes: CodeA, CodeB, CodeC',
      'Change',
      'Address',
      'Some address 1  Some address 2',
      'Change',
      'Town or city',
      'London',
      'Change',
      'County',
      'London',
      'Change',
      'Postcode',
      '511111',
      'Change',
      'Yes  Trading name',
      '',
      'Change',
      'Email address',
      '1@o.com',
      'Change',
      'Telephone number',
      '44 02071234567',
      'Change',
      'No',
      '',
      'Change',
      'Yes',
      '',
      'Change',
      'Overseas parent company name',
      'Parent company name',
      'Change',
      'The trading or other name of the group of undertakings to which the above company is the overseas parent (optional)',
      'Parent company trading name',
      'Change',
    ]);
  });

  it('should not display registration number if it does not exist', async () => {
    component.responsibleUndertaking.organisationDetails.registrationNumber = null;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('[govukSummaryListRowValue]').textContent.trim()).not.toContain('AB123456');
  });
});
