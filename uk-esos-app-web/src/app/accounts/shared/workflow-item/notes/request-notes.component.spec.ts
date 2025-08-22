import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestNotesService } from 'esos-api';

import { SharedUserModule } from '../../../../shared-user/shared-user.module';
import { mockRequestNotesResults } from '../../../testing/mock-data';
import { RequestNotesComponent } from './request-notes.component';

describe('RequestNotesComponent', () => {
  let component: RequestNotesComponent;
  let fixture: ComponentFixture<RequestNotesComponent>;
  let page: Page;

  const requestNotesService: MockType<RequestNotesService> = {
    getNotesByRequestId: jest.fn().mockReturnValue(of(mockRequestNotesResults)),
  };
  const activatedRoute = new ActivatedRouteStub({ accountId: '1', 'request-id': 'requestId' });

  class Page extends BasePage<RequestNotesComponent> {
    get notesContent() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [row.querySelectorAll('dd')[0]])
        .map((pair) => pair.map((element) => element.textContent.trim()));
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, SharedUserModule, GovukDatePipe],
      providers: [
        { provide: RequestNotesService, useValue: requestNotesService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestNotesComponent);
    component = fixture.componentInstance;
    component.currentTab = 'notes';
    page = new Page(fixture);
    jest.clearAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show notes', () => {
    const govukDatePipe = new GovukDatePipe();
    expect(requestNotesService.getNotesByRequestId).toHaveBeenCalledTimes(1);
    expect(requestNotesService.getNotesByRequestId).toHaveBeenLastCalledWith('requestId', 0, 10);

    expect(page.notesContent).toEqual([
      ['Add a note'],
      [
        `The note 1
file 1Submitter 1, ${govukDatePipe.transform(mockRequestNotesResults.requestNotes[0].lastUpdatedOn, 'datetime')}`,
      ],
      [
        `The note 2
Submitter 2, ${govukDatePipe.transform(mockRequestNotesResults.requestNotes[1].lastUpdatedOn, 'datetime')}`,
      ],
    ]);
  });
});
