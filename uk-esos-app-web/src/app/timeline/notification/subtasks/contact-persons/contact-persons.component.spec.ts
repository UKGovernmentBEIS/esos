import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@common/request-action/+state';
import { ActivatedRouteStub, BasePage } from '@testing';
import ContactPersonsComponent from '@timeline/notification/subtasks/contact-persons/contact-persons.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('ContactPersonsComponent', () => {
  let component: ContactPersonsComponent;
  let fixture: ComponentFixture<ContactPersonsComponent>;
  let store: RequestActionStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<ContactPersonsComponent> {
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
      providers: [RequestActionStore, { provide: ActivatedRoute, useValue: route }],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionState);

    fixture = TestBed.createComponent(ContactPersonsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      ['First name', 'John'],
      ['Last name', 'Doe'],
      ['Job title', 'Job title'],
      ['Email address', 'primary@email'],
      ['Address', 'Line'],
      ['Town or city', 'City'],
      ['County', 'County'],
      ['Postcode', 'Postcode'],
      ['Phone number 1', 'UK (44) 1234567890'],
      ['Phone number 2', ''],
      ['First name', 'Jane'],
      ['Last name', 'Doe'],
      ['Job title', 'Job title'],
      ['Email address', ''],
      ['Address', 'Line'],
      ['Town or city', 'City'],
      ['County', 'County'],
      ['Postcode', 'Postcode'],
      ['Phone number 1', 'UK (44) 1234567890'],
      ['Phone number 2', ''],
    ]);
  });
});
