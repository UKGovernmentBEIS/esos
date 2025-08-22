import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { mockRequestNotesResults } from '@accounts/testing/mock-data';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, asyncData, BasePage, MockType } from '@testing';

import { RequestNotesService } from 'esos-api';

import { RequestNoteComponent } from './request-note.component';

describe('RequestNoteComponent', () => {
  let component: RequestNoteComponent;
  let fixture: ComponentFixture<RequestNoteComponent>;
  let page: Page;

  const requestId = 'requestId';
  const noteId = 2;
  const activatedRoute = new ActivatedRouteStub();

  const requestNotesService: MockType<RequestNotesService> = {
    createRequestNote: jest.fn().mockReturnValue(asyncData(null)),
    updateRequestNote: jest.fn().mockReturnValue(asyncData(null)),
    getRequestNote: jest.fn().mockReturnValue(asyncData(mockRequestNotesResults.requestNotes[0])),
    uploadRequestNoteFile: jest.fn().mockReturnValue(asyncData({ uuid: '0500d8b5-8cfb-4430-8edd-75f7612a7287' })),
  };

  const runOnPushChangeDetection = async (fixture: ComponentFixture<any>): Promise<void> => {
    const changeDetectorRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    changeDetectorRef.detectChanges();
    return fixture.whenStable();
  };

  class Page extends BasePage<RequestNoteComponent> {
    get title() {
      return this.query<HTMLDivElement>('.govuk-heading-l');
    }
    get noteContent() {
      return this.getInputValue('#note');
    }

    set noteContent(value: string) {
      this.setInputValue('#note', value);
    }

    get filesText() {
      return this.queryAll<HTMLDivElement>('.moj-multi-file-upload__message');
    }

    set fileValue(value: File) {
      this.setInputValue('input[type="file"]', value);
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }

    get errorSummary() {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get errors() {
      return this.queryAll<HTMLAnchorElement>('.govuk-error-summary li a');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(RequestNoteComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), SharedModule, PageHeadingComponent],
      providers: [
        DestroySubject,
        { provide: RequestNotesService, useValue: requestNotesService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should successfully create a note', async () => {
    activatedRoute.setParamMap({ 'request-id': 'requestId' });
    activatedRoute.setResolveMap({
      heading: 'Add a note',
    });
    createComponent();

    await runOnPushChangeDetection(fixture);

    page.submitButton.click();

    await runOnPushChangeDetection(fixture);

    expect(page.title.textContent).toEqual('Add a note');
    expect(page.filesText.map((row) => row.textContent.trim())).toEqual([]);
    expect(page.errorSummary).toBeTruthy();
    expect(page.errorSummary.textContent).toContain('Enter a note');

    page.noteContent = 'A note is added';
    page.submitButton.click();
    await runOnPushChangeDetection(fixture);

    expect(page.errorSummary).toBeFalsy();
    expect(requestNotesService.createRequestNote).toHaveBeenCalledTimes(1);
    expect(requestNotesService.createRequestNote).toHaveBeenCalledWith({
      requestId,
      files: [],
      note: 'A note is added',
    });
  });

  it('should successfully edit a note', async () => {
    activatedRoute.setParamMap({ 'request-id': 'requestId', noteId });
    activatedRoute.setResolveMap({
      heading: 'Edit a note',
    });
    createComponent();

    await runOnPushChangeDetection(fixture);

    expect(page.title.textContent).toEqual('Edit a note');
    expect(page.noteContent).toEqual('The note 1');

    await fixture.whenStable();
    await runOnPushChangeDetection(fixture);

    expect(page.filesText.map((row) => row.textContent.trim())).toEqual(['file 1']);

    page.noteContent = 'Note has changed';
    page.submitButton.click();

    await runOnPushChangeDetection(fixture);

    expect(page.errorSummary).toBeFalsy();
    expect(requestNotesService.updateRequestNote).toHaveBeenCalledTimes(1);
    expect(requestNotesService.updateRequestNote).toHaveBeenCalledWith(noteId, {
      files: ['0500d8b5-8cfb-4430-8edd-75f7612a7287'],
      note: 'Note has changed',
    });
  });
});
