import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
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

import { EnergyConsumptionReductionComponent } from './energy-consumption-reduction.component';

describe('EnergyConsumptionReductionComponent', () => {
  let component: EnergyConsumptionReductionComponent;
  let fixture: ComponentFixture<EnergyConsumptionReductionComponent>;
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

  class Page extends BasePage<EnergyConsumptionReductionComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get buildings(): number {
      return +this.getInputValue('#buildings.energyConsumption');
    }

    set buildings(value: number) {
      this.setInputValue('#buildings.energyConsumption', value);
    }

    get transport(): number {
      return +this.getInputValue('#transport.energyConsumption');
    }

    set transport(value: number) {
      this.setInputValue('#transport.energyConsumption', value);
    }

    get industrialProcesses(): number {
      return +this.getInputValue('#industrialProcesses.energyConsumption');
    }

    set industrialProcesses(value: number) {
      this.setInputValue('#industrialProcesses.energyConsumption', value);
    }

    get otherProcesses(): number {
      return +this.getInputValue('#otherProcesses.energyConsumption');
    }

    set otherProcesses(value: number) {
      this.setInputValue('#otherProcesses.energyConsumption', value);
    }

    get totalConsumption() {
      return this.query<HTMLParagraphElement>(
        '.govuk-heading-m + .govuk-grid-row .govuk-grid-column-one-third:nth-child(1)',
      ).textContent.trim();
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(EnergyConsumptionReductionComponent);
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

  describe('for new energy consumption reduction details', () => {
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
      expect(page.heading1.textContent.trim()).toEqual(alternativeComplianceRoutesMap.energyConsumptionReduction.title);
      expect(page.submitButton).toBeTruthy();
    });

    it('should submit a valid form and navigate to nextRoute', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.buildings = 1;
      page.transport = 2;
      page.industrialProcesses = 3;
      page.otherProcesses = 4;

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.ENERGY_CONSUMPTION_REDUCTION,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              energyConsumptionReduction: {
                buildings: { energyConsumption: 1, energyCost: null },
                transport: { energyConsumption: 2, energyCost: null },
                industrialProcesses: { energyConsumption: 3, energyCost: null },
                otherProcesses: { energyConsumption: 4, energyCost: null },
                energyConsumptionTotal: 10,
                energyCostTotal: null,
              },
            },
          },
        },
      });
    });
  });

  describe('for existing energy consumption reduction details', () => {
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
      expect(page.heading1.textContent.trim()).toEqual(alternativeComplianceRoutesMap.energyConsumptionReduction.title);
      expect(page.buildings).toEqual(1);
      expect(page.transport).toEqual(2);
      expect(page.industrialProcesses).toEqual(4);
      expect(page.otherProcesses).toEqual(2);
      expect(page.totalConsumption).toEqual('9 kWh');
      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.ENERGY_CONSUMPTION_REDUCTION,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              energyConsumptionReduction: {
                ...mockAlternativeComplianceRoutes.energyConsumptionReduction,
                energyConsumptionTotal: 9,
              },
            },
          },
        },
      });
    });
  });
});
