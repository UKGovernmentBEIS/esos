import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import ComplianceRouteComponent from '@timeline/notification/subtasks/compliance-route/compliance-route.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('ComplianceRouteComponent', () => {
  let component: ComplianceRouteComponent;
  let fixture: ComponentFixture<ComplianceRouteComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<ComplianceRouteComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__column')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestActionStore],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionState);

    fixture = TestBed.createComponent(ComplianceRouteComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([['Yes'], ['No'], ['Yes'], ['Skip question'], ['No']]);
  });
});
