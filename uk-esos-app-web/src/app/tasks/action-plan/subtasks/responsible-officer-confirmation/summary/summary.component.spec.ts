import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActionPlanTaskPayload } from '@tasks/action-plan/action-plan.types';
import { ActionPlanService } from '@tasks/action-plan/services/action-plan.service';
import {
  mockActionPlanEnergyEfficiencyMeasure,
  mockActionPlanResponsibleOfficerConfirmation,
  mockStateBuild,
} from '@tasks/action-plan/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import {
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
  ResponsibleOfficerConfirmationStep,
} from '../responsible-officer-confirmation.helper';
import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<ActionPlanService> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): ActionPlanTaskPayload {
      return {
        actionPlanP3: {
          energyEfficiencyMeasure: mockActionPlanEnergyEfficiencyMeasure,
          responsibleOfficerConfirmation: mockActionPlanResponsibleOfficerConfirmation,
        },
      };
    },
  };

  class Page extends BasePage<SummaryComponent> {
    get summaryComponent() {
      return this.query<HTMLElement>('esos-action-plan-responsible-officer-confirmation-summary-page');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
      ],
    });
    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { energyEfficiencyMeasure: mockActionPlanEnergyEfficiencyMeasure },
        { energyEfficiencyMeasure: TaskItemStatus.IN_PROGRESS },
      ),
    );
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summaryComponent).toBeTruthy();
    expect(page.submitButton).toBeTruthy();
  });

  it('should submit a valid form and navigate to nextRoute', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
      currentStep: ResponsibleOfficerConfirmationStep.SUMMARY,
      payload: {
        actionPlanP3: {
          energyEfficiencyMeasure: mockActionPlanEnergyEfficiencyMeasure,
          responsibleOfficerConfirmation: mockActionPlanResponsibleOfficerConfirmation,
        },
      },
      route,
    });
  });
});
