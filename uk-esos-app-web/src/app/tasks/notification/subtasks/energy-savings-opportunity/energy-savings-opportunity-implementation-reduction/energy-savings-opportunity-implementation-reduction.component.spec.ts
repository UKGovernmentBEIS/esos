import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  mockEnergySavingOpportunities,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import {
  ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
  EnergySavingsOpportunitiesCurrentStep,
} from '../energy-savings-opportunity.helper';
import EnergySavingsOpportunityImplementationReductionComponent from './energy-savings-opportunity-implementation-reduction.component';

describe('EnergySavingsOpportunityImplementationReductionComponent', () => {
  let component: EnergySavingsOpportunityImplementationReductionComponent;
  let fixture: ComponentFixture<EnergySavingsOpportunityImplementationReductionComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          energySavingsOpportunities: mockEnergySavingOpportunities,
        } as any,
      };
    },
  };

  class Page extends BasePage<EnergySavingsOpportunityImplementationReductionComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get implementationEnergyConsumptionReduction() {
      return this.getInputValue('#implementationEnergyConsumption.energyConsumption');
    }

    set implementationEnergyConsumptionReduction(value: number) {
      this.setInputValue('#implementationEnergyConsumption.energyConsumption', value);
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(EnergySavingsOpportunityImplementationReductionComponent);
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

  describe('for new implementation consumption reduction details', () => {
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
        'Total annual reduction in energy consumption and energy spend from implementing energy saving opportunities',
      );
      expect(page.submitButton).toBeTruthy();
    });

    it('should submit a valid form and navigate to nextRoute', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.implementationEnergyConsumptionReduction = 2;
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
        currentStep: EnergySavingsOpportunitiesCurrentStep.STEP1,
        route: route,
        payload: {
          noc: {
            energySavingsOpportunities: {
              ...mockEnergySavingOpportunities,
              implementationEnergyConsumption: {
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

      page.implementationEnergyConsumptionReduction = 1;

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
        currentStep: EnergySavingsOpportunitiesCurrentStep.STEP1,
        route: route,
        payload: {
          noc: {
            energySavingsOpportunities: {
              ...mockEnergySavingOpportunities,
              implementationEnergyConsumption: {
                energyConsumption: 1,
                energyCost: null,
              },
            },
          },
        },
      });
    });
  });

  describe('for existing implementation consumption reduction details', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { energySavingsOpportunities: mockEnergySavingOpportunities },
          { energySavingsOpportunities: TaskItemStatus.IN_PROGRESS },
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
      expect(page.implementationEnergyConsumptionReduction).toEqual('100');
      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
        currentStep: EnergySavingsOpportunitiesCurrentStep.STEP1,
        route: route,
        payload: {
          noc: {
            energySavingsOpportunities: mockEnergySavingOpportunities,
          },
        },
      });
    });
  });
});
