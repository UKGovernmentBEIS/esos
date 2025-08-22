import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { BasePage } from '@testing';
import { screen } from '@testing-library/angular';

import { ActionPlanErrorComponent } from './action-plan-errors.component';
import { ActionPlanErrorData } from './action-plan-errors.interfaces';
import { ActionPlanErrorService } from './action-plan-errors.service';

describe('ActionPlanErrorComponent', () => {
  let component: ActionPlanErrorComponent;
  let fixture: ComponentFixture<ActionPlanErrorComponent>;
  let page: Page;
  let router: Router;
  const taskService = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    saveSubtask: () => {},
    payload: {},
  };

  const actionPlanErrorService = {
    error: signal({}),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    clear: () => {},
  };

  class Page extends BasePage<ActionPlanErrorComponent> {
    get errorMessages() {
      return this.queryAll('li.govuk-error-message.error-message');
    }
  }

  const data_AP1001: ActionPlanErrorData = {
    code: 'AP1001',
    message: 'Invalid Submission Date',
    data: [[]],
  };

  const data_AP1002: ActionPlanErrorData = {
    code: 'AP1002',
    message: 'Invalid ACTION PLAN',
    data: [
      [
        {
          sectionName: 'uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3',
          message: 'Invalid section data',
          data: [
            [
              'actionPlan - Not valid ResponsibleOfficerConfirmationType.',
              'actionPlan.energyEfficiencyMeasure.energyEfficiencyMeasures[0] - The deadline cannot be earlier than December 2023',
            ],
          ],
        },
      ],
    ],
  };

  function createComponent(mockData) {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActionPlanErrorService, useValue: actionPlanErrorService },
      ],
    });
    router = TestBed.inject(Router);
    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue({ extras: { state: { data: mockData } } } as any);
    fixture = TestBed.createComponent(ActionPlanErrorComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(data_AP1002);
    expect(component).toBeTruthy();
  });

  it('should display invalid submission date error', () => {
    createComponent(data_AP1001);

    expect(component).toBeTruthy();
    expect(errorSummaryTitle()).toBeVisible();
    expect(page.errorMessages.length).toEqual(1);
    expect(errorMessageInvalidSubmissionDate()).toBeVisible();
  });

  it('should display two error messages with links', () => {
    createComponent(data_AP1002);

    expect(component).toBeTruthy();
    expect(errorSummaryTitle()).toBeVisible();
    expect(page.errorMessages.length).toEqual(2);
    expect(errorMessageResponsibleOfficerConfirmation()).toBeVisible();
    expect(errorMessageResponsibleOfficerConfirmationLink()).toBeVisible();
    expect(errorMessageDeadline()).toBeVisible();
    expect(errorMessageDeadlineLink()).toBeVisible();
  });

  function errorSummaryTitle() {
    return screen.getByText('There is a problem');
  }

  function errorMessageInvalidSubmissionDate() {
    return screen.getByText('Submission not allowed.');
  }

  function errorMessageDeadline() {
    return screen.getByText('The deadline cannot be earlier than', { exact: false });
  }

  function errorMessageDeadlineLink() {
    return screen.getByText('Change Energy efficiency measures answers', { exact: true });
  }

  function errorMessageResponsibleOfficerConfirmation() {
    return screen.getByText('Not valid ResponsibleOfficerConfirmationType', { exact: false });
  }

  function errorMessageResponsibleOfficerConfirmationLink() {
    return screen.getByText('Change Responsible officer confirmation answers', { exact: true });
  }
});
