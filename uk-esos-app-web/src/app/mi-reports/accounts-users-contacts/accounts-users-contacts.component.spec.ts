import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { asyncData, BasePage } from '@testing';

import { MiReportsService } from 'esos-api';

import { mockAccountsUsersContactsMiReportResult } from '../testing/mock-data';
import { AccountsUsersContactsComponent } from './accounts-users-contacts.component';

class Page extends BasePage<AccountsUsersContactsComponent> {
  get table() {
    return this.query<HTMLDivElement>('.govuk-table');
  }

  get executeButton() {
    return this.query<HTMLButtonElement>('button');
  }
}

describe('AccountsUsersContactsComponent', () => {
  let component: AccountsUsersContactsComponent;
  let fixture: ComponentFixture<AccountsUsersContactsComponent>;
  let page: Page;
  let miReportsService: Partial<jest.Mocked<MiReportsService>>;

  beforeEach(async () => {
    miReportsService = {
      generateReport: jest.fn().mockReturnValue(asyncData(mockAccountsUsersContactsMiReportResult)),
    };

    await TestBed.configureTestingModule({
      imports: [SharedModule, PageHeadingComponent, RouterTestingModule],
      declarations: [AccountsUsersContactsComponent],
      providers: [{ provide: MiReportsService, useValue: miReportsService }, DestroySubject],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsUsersContactsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table rows', () => {
    page.executeButton.click();
    fixture.detectChanges();
    const cells = Array.from(page.table.querySelectorAll('td'));

    expect(cells.map((cell) => cell.textContent.trim())).toEqual([
      ...[
        'Organisation',
        '1',
        'Organisation name',
        'Live',
        '',
        '',
        'Legal entity',
        'true',
        'false',
        'true',
        'true',
        'Active',
        'Obi Wan Kenobi',
        '+442345254566656565',
        'owk@mail.com',
        'Operator admin',
      ],
      ...[
        'Organisation',
        '31',
        'Organisation name 2',
        'Live',
        '',
        '',
        'Legal entity 2',
        'true',
        'false',
        'true',
        'false',
        'Active',
        'Darth Vader',
        '+442345254566656562',
        'dv@mail.gr',
        'Operator admin',
      ],
    ]);
  });
});
