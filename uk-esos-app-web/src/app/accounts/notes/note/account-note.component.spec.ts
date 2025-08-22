import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AccountNoteComponent } from '@accounts/index';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, asyncData, BasePage, MockType } from '@testing';

import { AccountNotesService } from 'esos-api';

import { mockAccountNotesResults } from '../../testing/mock-data';

describe('AddEditTemplateComponent', () => {
  let component: AccountNoteComponent;
  let fixture: ComponentFixture<AccountNoteComponent>;
  let page: Page;

  const accountId = 1;
  const noteId = 2;
  const activatedRoute = new ActivatedRouteStub();

  const accountNotesService: MockType<AccountNotesService> = {
    createAccountNote: jest.fn().mockReturnValue(asyncData(null)),
    updateAccountNote: jest.fn().mockReturnValue(asyncData(null)),
    getAccountNote: jest.fn().mockReturnValue(asyncData(mockAccountNotesResults.accountNotes[0])),
    uploadAccountNoteFile: jest.fn().mockReturnValue(asyncData({ uuid: '0500d8b5-8cfb-4430-8edd-75f7612a7287' })),
  };

  const runOnPushChangeDetection = async (fixture: ComponentFixture<any>): Promise<void> => {
    const changeDetectorRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    changeDetectorRef.detectChanges();
    return fixture.whenStable();
  };

  class Page extends BasePage<AccountNoteComponent> {
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
    fixture = TestBed.createComponent(AccountNoteComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountNoteComponent],
      imports: [RouterModule.forRoot([]), SharedModule, PageHeadingComponent],
      providers: [
        DestroySubject,
        { provide: AccountNotesService, useValue: accountNotesService },
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
    activatedRoute.setParamMap({ accountId });
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
    expect(accountNotesService.createAccountNote).toHaveBeenCalledTimes(1);
    expect(accountNotesService.createAccountNote).toHaveBeenCalledWith({
      accountId,
      files: [],
      note: 'A note is added',
    });
  });

  it('should successfully edit a note', async () => {
    activatedRoute.setParamMap({ accountId, noteId });
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
    expect(accountNotesService.updateAccountNote).toHaveBeenCalledTimes(1);
    expect(accountNotesService.updateAccountNote).toHaveBeenCalledWith(noteId, {
      files: ['0500d8b5-8cfb-4430-8edd-75f7612a7287'],
      note: 'Note has changed',
    });
  });
});
