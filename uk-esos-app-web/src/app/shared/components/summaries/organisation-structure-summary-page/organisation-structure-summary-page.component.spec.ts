import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { OrganisationStructureSummaryPageComponent } from '@shared/components/summaries';
import { BasePage } from '@testing';

import { OrganisationDetails, OrganisationStructure } from 'esos-api';

describe('OrganisationStructureSummaryPageComponent', () => {
  let component: OrganisationStructureSummaryPageComponent;
  let fixture: ComponentFixture<OrganisationStructureSummaryPageComponent>;
  let page: Page;

  const organisationStructure = {
    isHighestParent: true,
    isNonComplyingUndertakingsIncluded: false,
    organisationsAssociatedWithRU: [
      {
        registrationNumberExist: true,
        registrationNumber: '00000000',
        hasCeasedToBePartOfGroup: true,
        classificationCodesDetails: {
          areSameAsRU: false,
          codes: {
            type: 'SIC',
            codes: ['111111'],
          },
        },
        isParentOfResponsibleUndertaking: true,
        isPartOfArrangement: true,
        isPartOfFranchise: false,
        isSubsidiaryOfResponsibleUndertaking: true,
        organisationName: 'Organisation name',
      },
    ],
    isGroupStructureChartProvided: true,
  } as OrganisationStructure;

  const route = new ActivatedRoute();
  route.snapshot = new ActivatedRouteSnapshot();
  route.snapshot.queryParams = { page: 1 };

  class Page extends BasePage<OrganisationStructureSummaryPageComponent> {
    get heading() {
      return this.queryAll<HTMLHeadElement>('h2').map((el) => el?.textContent?.trim());
    }

    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [row.querySelector('dt'), row.querySelectorAll('dd')[0]])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }

    get summaryListColumnValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__column')
        .map((row) => [row.querySelectorAll('dd')[0]])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }

    get table() {
      return this.queryAll('.govuk-table');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: ActivatedRoute, useValue: route }] });
    fixture = TestBed.createComponent(OrganisationStructureSummaryPageComponent);
    component = fixture.componentInstance;
    component.vm = {
      subtaskName: 'organisationStructure',
      data: organisationStructure,
      isEditable: false,
      sectionsCompleted: { organisationStructure: 'COMPLETED' },
      wizardStep: {},
      organisationDetails: {
        city: 'City',
        county: 'Powys',
        line1: 'Line 1',
        line2: 'Line 2',
        name: 'Ru Org Name',
        postcode: 'Postcode',
      } as OrganisationDetails,
    };
    component.organisationStructure = signal(organisationStructure);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the titles', () => {
    expect(page.heading).toEqual([
      'Is the responsible undertaking a highest parent which has agreed to aggregate with one or more other highest parents to comply as one participant?',
      'Did the responsible undertaking’s group include any undertakings on 31 December 2022 which either disaggregated from, or ceased to be part of the participant before 5 June 2024 and which are not complying as if they were still a member of the participant?',
      "Add information on the organisations complying as one participant in the responsible undertaking's notification for its corporate group",
    ]);
  });

  it('should display summary details and list', () => {
    expect(page.summaryListValues).toEqual([
      [
        'Do you also wish to provide a corporate group structure chart or other information setting out the relationship between the RU and relevant undertakings complying with the scheme as one participant?',
        'Yes',
      ],
    ]);

    expect(page.summaryListColumnValues).toEqual([['Yes'], ['No']]);

    expect(page.table.length).toEqual(1);
  });
});
