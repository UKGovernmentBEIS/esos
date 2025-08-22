import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { BasePage } from '@testing';
import { screen } from '@testing-library/angular';

import { ProgressUpdate2ErrorComponent } from './progress-update-2-errors.component';
import { ProgressUpdate2ErrorData } from './progress-update-2-errors.interfaces';
import { ProgressUpdate2ErrorService } from './progress-update-2-errors.service';

describe('ProgressUpdate2ErrorComponent', () => {
  let component: ProgressUpdate2ErrorComponent;
  let fixture: ComponentFixture<ProgressUpdate2ErrorComponent>;
  let page: Page;
  let router: Router;
  const taskService = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    saveSubtask: () => {},
    payload: {},
  };

  const progressUpdate2ErrorService = {
    error: signal({}),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    clear: () => {},
  };

  class Page extends BasePage<ProgressUpdate2ErrorComponent> {
    get errorMessages() {
      return this.queryAll('li.govuk-error-message.error-message');
    }
  }

  const data_PU11002: ProgressUpdate2ErrorData = {
    code: 'PU11002',
    message: 'Invalid Submission Date',
    data: [[]],
  };

  const data_PU21004: ProgressUpdate2ErrorData = {
    code: 'PU21004',
    message: 'Invalid Progress Update 2',
    data: [
      [
        {
          sectionName: 'uk.gov.esos.api.reporting.progressupdate2.phase3.domain.ProgressUpdate2P3',
          message: 'Invalid section data',
          data: [['progressUpdate2P3 - Not valid ResponsibleOfficerConfirmationType.']],
        },
      ],
    ],
  };

  function createComponent(mockData) {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ProgressUpdate2ErrorService, useValue: progressUpdate2ErrorService },
      ],
    });
    router = TestBed.inject(Router);
    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue({ extras: { state: { data: mockData } } } as any);
    fixture = TestBed.createComponent(ProgressUpdate2ErrorComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(data_PU21004);
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
    createComponent(data_PU21004);

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
