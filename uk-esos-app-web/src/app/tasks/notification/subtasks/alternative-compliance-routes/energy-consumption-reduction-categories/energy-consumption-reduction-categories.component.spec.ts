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
import { mockAlternativeComplianceRoutes, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { EnergyConsumptionReductionCategoriesComponent } from './energy-consumption-reduction-categories.component';

describe('EnergyConsumptionReductionCategoriesComponent', () => {
  let component: EnergyConsumptionReductionCategoriesComponent;
  let fixture: ComponentFixture<EnergyConsumptionReductionCategoriesComponent>;
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

  class Page extends BasePage<EnergyConsumptionReductionCategoriesComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get energyManagementPractices(): number {
      return +this.getInputValue('#energyManagementPractices.energyConsumption');
    }

    set energyManagementPractices(value: number) {
      this.setInputValue('#energyManagementPractices.energyConsumption', value);
    }

    get behaviourChangeInterventions(): number {
      return +this.getInputValue('#behaviourChangeInterventions.energyConsumption');
    }

    set behaviourChangeInterventions(value: number) {
      this.setInputValue('#behaviourChangeInterventions.energyConsumption', value);
    }

    get training(): number {
      return +this.getInputValue('#training.energyConsumption');
    }

    set training(value: number) {
      this.setInputValue('#training.energyConsumption', value);
    }

    get controlsImprovements(): number {
      return +this.getInputValue('#controlsImprovements.energyConsumption');
    }

    set controlsImprovements(value: number) {
      this.setInputValue('#controlsImprovements.energyConsumption', value);
    }

    get capitalInvestments(): number {
      return +this.getInputValue('#capitalInvestments.energyConsumption');
    }

    set capitalInvestments(value: number) {
      this.setInputValue('#capitalInvestments.energyConsumption', value);
    }

    get otherMeasures(): number {
      return +this.getInputValue('#otherMeasures.energyConsumption');
    }

    set otherMeasures(value: number) {
      this.setInputValue('#otherMeasures.energyConsumption', value);
    }

    get totalConsumption() {
      return this.query<HTMLParagraphElement>(
        '.govuk-heading-m + .govuk-grid-row .govuk-grid-column-one-third:nth-child(1)',
      ).textContent.trim();
    }

    get errorSummaryListContents(): string[] {
      return Array.from(this.errorSummary.querySelectorAll<HTMLAnchorElement>('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(EnergyConsumptionReductionCategoriesComponent);
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
      store.setState(
        mockStateBuild(
          {
            reportingObligation: {
              qualificationType: 'QUALIFY',
              noQualificationReason: 'no reason',
              reportingObligationDetails: {
                qualificationReasonType: 'TURNOVER_MORE_THAN_44M',
                energyResponsibilityType: 'RESPONSIBLE',
                complianceRouteDistribution: {
                  iso50001Pct: 100,
                  displayEnergyCertificatePct: 0,
                  greenDealAssessmentPct: 0,
                  energyAuditsPct: 0,
                  energyNotAuditedPct: 0,
                  totalPct: 100,
                },
              },
            },
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              totalEnergyConsumptionReduction: { energyConsumption: 28, energyCost: '0' },
            },
          },
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
        alternativeComplianceRoutesMap.energyConsumptionReductionCategories.title,
      );
      expect(page.submitButton).toBeTruthy();
    });

    it('should submit a valid form and navigate to nextRoute', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.energyManagementPractices = 1;
      page.behaviourChangeInterventions = 2;
      page.training = 1;
      page.controlsImprovements = 2;
      page.capitalInvestments = 2;
      page.otherMeasures = 1;

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.ENERGY_CONSUMPTION_REDUCTION_CATEGORIES,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              energyConsumptionReductionCategories: {
                energyManagementPractices: { energyConsumption: 1, energyCost: '0.00' },
                behaviourChangeInterventions: { energyConsumption: 2, energyCost: '0.00' },
                training: { energyConsumption: 1, energyCost: '0.00' },
                controlsImprovements: { energyConsumption: 2, energyCost: '0.00' },
                capitalInvestments: { energyConsumption: 2, energyCost: '0.00' },
                otherMeasures: { energyConsumption: 1, energyCost: '0.00' },
                energyConsumptionTotal: 9,
                energyCostTotal: '0.00',
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
      expect(page.heading1.textContent.trim()).toEqual(
        alternativeComplianceRoutesMap.energyConsumptionReductionCategories.title,
      );
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
        currentStep: CurrentStep.ENERGY_CONSUMPTION_REDUCTION_CATEGORIES,
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
