import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActionPlanTaskPayload } from '@tasks/action-plan/action-plan.types';
import { ActionPlanService } from '@tasks/action-plan/services/action-plan.service';
import { mockActionPlanEnergyEfficiencyMeasure, mockStateBuild } from '@tasks/action-plan/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  EnergyEfficiencyMeasuresStep,
} from '../energy-efficiency-measures.helper';
import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let page: Page;
  let router: Router;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<ActionPlanService> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): ActionPlanTaskPayload {
      return {
        actionPlanP3: {
          energyEfficiencyMeasure: mockActionPlanEnergyEfficiencyMeasure,
        },
      };
    },
  };

  class Page extends BasePage<SummaryComponent> {
    get summaryComponent() {
      return this.query<HTMLElement>('esos-energy-efficiency-measures-summary-page');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }

    get addMeasureButton(): HTMLAnchorElement {
      return this.query('a.govuk-button--secondary');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
      ],
    });
    router = TestBed.inject(Router);

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
    expect(page.addMeasureButton).toBeTruthy();
    expect(page.submitButton).toBeTruthy();
  });

  it('should navigate when Add Another Measure button clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');

    page.addMeasureButton.click();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should submit a valid form', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: EnergyEfficiencyMeasuresStep.SUMMARY,
      payload: {
        actionPlanP3: {
          energyEfficiencyMeasure: mockActionPlanEnergyEfficiencyMeasure,
        },
      },
      route,
      applySideEffects: true,
    });
  });
});
