import { computed } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { BasePage } from '@testing';

import { OrganisationStructureListTableComponent } from './organisations-structure-list-template.component';

describe('ListTableComponent', () => {
  let component: OrganisationStructureListTableComponent;
  let fixture: ComponentFixture<OrganisationStructureListTableComponent>;
  let page: Page;

  const route = new ActivatedRoute();
  route.snapshot = new ActivatedRouteSnapshot();
  route.snapshot.queryParams = { page: 1 };

  class Page extends BasePage<OrganisationStructureListTableComponent> {
    get organisationsTable() {
      return this.query('.govuk-table');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: ActivatedRoute, useValue: route }] });

    fixture = TestBed.createComponent(OrganisationStructureListTableComponent);
    component = fixture.componentInstance;
    component.vm = {
      header: 'Header',
      isListPreviousPage: true,
      wizardStep: {},
      isEditable: false,
      organisationDetails: {
        name: 'Ru Org Name',
        registrationNumber: '1111',
        type: 'SIC',
        codes: ['2222'],
        city: 'City',
        county: 'Powys',
        line1: 'Line 1',
        line2: 'Line 2',
        postcode: 'Postcode',
      },
    };
    component.organisationStructure = computed(() => ({
      isHighestParent: true,
      isNonComplyingUndertakingsIncluded: false,
      organisationsAssociatedWithRU: [
        {
          registrationNumberExist: false,
          hasCeasedToBePartOfGroup: true,
          classificationCodesDetails: {
            areSameAsRU: true,
          },
          isParentOfResponsibleUndertaking: true,
          isPartOfArrangement: true,
          isPartOfFranchise: false,
          isSubsidiaryOfResponsibleUndertaking: true,
          organisationName: 'Organisation name',
        },
      ],
      isGroupStructureChartProvided: true,
    }));
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading text', () => {
    const headingElement = fixture.debugElement.query(By.css('.govuk-heading-m'));
    expect(headingElement.nativeElement.textContent).toBe('Header');
  });

  it('should display the table with organisations', () => {
    const cells = Array.from(page.organisationsTable.querySelectorAll('td'));

    expect(cells.map((cell) => cell.textContent.trim())).toEqual([
      ...[
        `Ru Org Name
1111RUShow activity codes SIC:  2222`,
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      ...[
        `Organisation name
Show activity codesSame as the RU's`,
        '✓',
        '✓',
        '✓',
        '',
        '✓',
        '',
      ],
    ]);
  });
});
