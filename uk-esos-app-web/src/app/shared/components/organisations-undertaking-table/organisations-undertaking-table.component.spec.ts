import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { OrganisationsUndertakingTableComponent } from '@shared/components/organisations-undertaking-table/organisations-undertaking-table.component';
import { BasePage } from '@testing';

describe('OrganisationsUndertakingTableComponent', () => {
  let component: OrganisationsUndertakingTableComponent;
  let fixture: ComponentFixture<OrganisationsUndertakingTableComponent>;
  let page: Page;

  const route = new ActivatedRoute();

  class Page extends BasePage<OrganisationsUndertakingTableComponent> {
    get rows() {
      return this.queryAll<HTMLTableRowElement>('govuk-table tr')
        .filter((el) => !el.querySelector('th'))
        .map((el) => Array.from(el.querySelectorAll('td')).map((td) => td.textContent.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: ActivatedRoute, useValue: route }] });

    fixture = TestBed.createComponent(OrganisationsUndertakingTableComponent);
    component = fixture.componentInstance;
    component.header = 'Header';
    component.data = [
      {
        organisationName: 'First undertaking',
        registrationNumber: '11111111',
      },
      {
        organisationName: 'Second undertaking',
        registrationNumber: '2222222',
      },
    ];
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
    expect(page.rows).toEqual([
      ['First undertaking', '11111111', ''],
      ['Second undertaking', '2222222', ''],
    ]);
  });
});
