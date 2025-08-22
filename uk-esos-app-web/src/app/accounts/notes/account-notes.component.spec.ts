import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { AccountNotesComponent } from '@accounts/index';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { AccountNotesService } from 'esos-api';

import { SharedUserModule } from '../../shared-user/shared-user.module';
import { mockAccountNotesResults } from '../testing/mock-data';

describe('NotesComponent', () => {
  let component: AccountNotesComponent;
  let fixture: ComponentFixture<AccountNotesComponent>;
  let page: Page;

  const accountNotesService: MockType<AccountNotesService> = {
    getNotesByAccountId: jest.fn().mockReturnValue(of(mockAccountNotesResults)),
  };
  const activatedRoute = new ActivatedRouteStub({ accountId: '1' });

  class Page extends BasePage<AccountNotesComponent> {
    get notesContent() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [row.querySelectorAll('dd')[0]])
        .map((pair) => pair.map((element) => element.textContent.trim()));
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukDatePipe, RouterTestingModule, SharedModule, SharedUserModule],
      providers: [
        { provide: AccountNotesService, useValue: accountNotesService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountNotesComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    jest.clearAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show notes', () => {
    const govukDatePipe = new GovukDatePipe();
    expect(accountNotesService.getNotesByAccountId).toHaveBeenCalledTimes(1);
    expect(accountNotesService.getNotesByAccountId).toHaveBeenLastCalledWith(1, 0, 10);

    expect(page.notesContent).toEqual([
      [
        `The note 1
file 1Submitter 1, ${govukDatePipe.transform(mockAccountNotesResults.accountNotes[0].lastUpdatedOn, 'datetime')}`,
      ],
      [
        `The note 2
Submitter 2, ${govukDatePipe.transform(mockAccountNotesResults.accountNotes[1].lastUpdatedOn, 'datetime')}`,
      ],
    ]);
  });
});
