import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { BasePage } from '@testing';
import { screen } from '@testing-library/angular';

import { ProgressUpdate1ErrorComponent } from './progress-update-1-errors.component';
import { ProgressUpdate1ErrorData } from './progress-update-1-errors.interfaces';
import { ProgressUpdate1ErrorService } from './progress-update-1-errors.service';

describe('ProgressUpdate1ErrorComponent', () => {
  let component: ProgressUpdate1ErrorComponent;
  let fixture: ComponentFixture<ProgressUpdate1ErrorComponent>;
  let page: Page;
  let router: Router;
  const taskService = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    saveSubtask: () => {},
    payload: {},
  };

  const progressUpdate1ErrorService = {
    error: signal({}),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    clear: () => {},
  };

  class Page extends BasePage<ProgressUpdate1ErrorComponent> {
    get errorMessages() {
      return this.queryAll('li.govuk-error-message.error-message');
    }
  }

  const data_PU11002: ProgressUpdate1ErrorData = {
    code: 'PU11002',
    message: 'Invalid Submission Date',
    data: [[]],
  };

  const data_PU11003: ProgressUpdate1ErrorData = {
    code: 'PU11003',
    message: 'Invalid Progress Update 1',
    data: [
      [
        {
          sectionName: 'uk.gov.esos.api.reporting.progressupdate1.phase3.domain.ProgressUpdate1P3',
          message: 'Invalid section data',
          data: [['progressUpdate1P3 - Not valid ResponsibleOfficerConfirmationType.']],
        },
      ],
    ],
  };

  function createComponent(mockData) {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ProgressUpdate1ErrorService, useValue: progressUpdate1ErrorService },
      ],
    });
    router = TestBed.inject(Router);
    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue({ extras: { state: { data: mockData } } } as any);
    fixture = TestBed.createComponent(ProgressUpdate1ErrorComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(data_PU11003);
    expect(component).toBeTruthy();
  });

  it('should display invalid submission date error', () => {
    createComponent(data_PU11002);

    expect(component).toBeTruthy();
    expect(errorSummaryTitle()).toBeVisible();
    expect(page.errorMessages.length).toEqual(1);
    expect(errorMessageInvalidSubmissionDate()).toBeVisible();
  });

  it('should display two error messages with links', () => {
    createComponent(data_PU11003);

    expect(component).toBeTruthy();
    expect(errorSummaryTitle()).toBeVisible();
    expect(page.errorMessages.length).toEqual(1);
    expect(errorMessageResponsibleOfficerConfirmation()).toBeVisible();
    expect(errorMessageResponsibleOfficerConfirmationLink()).toBeVisible();
  });

  function errorSummaryTitle() {
    return screen.getByText('There is a problem');
  }

  function errorMessageInvalidSubmissionDate() {
    return screen.getByText('Submission not allowed.');
  }

  function errorMessageResponsibleOfficerConfirmation() {
    return screen.getByText('Not valid ResponsibleOfficerConfirmationType', { exact: false });
  }

  function errorMessageResponsibleOfficerConfirmationLink() {
    return screen.getByText('Change Responsible officer confirmation answers', { exact: true });
  }
});
