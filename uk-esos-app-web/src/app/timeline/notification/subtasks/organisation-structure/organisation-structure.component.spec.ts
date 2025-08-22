import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import OrganisationStructureComponent from '@timeline/notification/subtasks/organisation-structure/organisation-structure.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('OrganisationStructureComponent', () => {
  let component: OrganisationStructureComponent;
  let fixture: ComponentFixture<OrganisationStructureComponent>;
  let store: RequestActionStore;
  let page: Page;

  const route = new ActivatedRoute();
  route.snapshot = new ActivatedRouteSnapshot();
  route.snapshot.queryParams = { page: 1 };

  class Page extends BasePage<OrganisationStructureComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
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
    TestBed.configureTestingModule({
      providers: [RequestActionStore, { provide: ActivatedRoute, useValue: route }],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionState);

    fixture = TestBed.createComponent(OrganisationStructureComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      [
        'Do you also wish to provide a corporate group structure chart or other information setting out the relationship between the RU and relevant undertakings complying with the scheme as one participant?',
        'Yes',
      ],
    ]);

    expect(page.summaryListColumnValues).toEqual([['Yes'], ['Yes']]);

    expect(page.table.length).toEqual(2);
  });
});
