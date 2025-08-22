import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import {
  mockAlternativeComplianceRoutes,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { TotalEnergyConsumptionReductionComponent } from './total-energy-consumption-reduction.component';

describe('TotalEnergyConsumptionReductionComponent', () => {
  let component: TotalEnergyConsumptionReductionComponent;
  let fixture: ComponentFixture<TotalEnergyConsumptionReductionComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          alternativeComplianceRoutes: mockAlternativeComplianceRoutes,
        } as any,
      };
    },
  };

  class Page extends BasePage<TotalEnergyConsumptionReductionComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get totalEnergyConsumptionReduction() {
      return this.getInputValue('#totalEnergyConsumptionReduction.energyConsumption');
    }

    set totalEnergyConsumptionReduction(value: number) {
      this.setInputValue('#totalEnergyConsumptionReduction.energyConsumption', value);
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(TotalEnergyConsumptionReductionComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
      ],
    });
  });

  describe('for new total energy consumption details', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(mockNotificationRequestTask);
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(page.errorSummary).toBeFalsy();
      expect(page.heading1).toBeTruthy();
      expect(page.heading1.textContent.trim()).toEqual(
        'Total annual reduction in energy consumption and energy spend from implementing energy saving measures',
      );
      expect(page.submitButton).toBeTruthy();
    });

    it('should submit a valid form and navigate to nextRoute', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.totalEnergyConsumptionReduction = 2;
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.TOTAL_ENERGY_CONSUMPTION_REDUCTION,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              totalEnergyConsumptionReduction: {
                energyConsumption: 2,
                energyCost: null,
              },
            },
          },
        },
      });
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.totalEnergyConsumptionReduction = 1;

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.TOTAL_ENERGY_CONSUMPTION_REDUCTION,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              totalEnergyConsumptionReduction: {
                energyConsumption: 1,
                energyCost: null,
              },
            },
          },
        },
      });
    });
  });

  describe('for existing total energy consumption details', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { alternativeComplianceRoutes: mockAlternativeComplianceRoutes },
          { alternativeComplianceRoutes: TaskItemStatus.IN_PROGRESS },
        ),
      );
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(page.errorSummary).toBeFalsy();
      expect(page.heading1).toBeTruthy();
      expect(page.heading1.textContent.trim()).toEqual(
        'Total annual reduction in energy consumption and energy spend from implementing energy saving measures',
      );
      expect(page.totalEnergyConsumptionReduction).toEqual('12');
      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.TOTAL_ENERGY_CONSUMPTION_REDUCTION,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: mockAlternativeComplianceRoutes,
          },
        },
      });
    });
  });
});
