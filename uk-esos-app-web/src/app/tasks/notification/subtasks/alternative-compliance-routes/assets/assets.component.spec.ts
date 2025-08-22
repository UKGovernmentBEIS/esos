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

import { AssetsComponent } from './assets.component';

describe('AssetsComponent', () => {
  let component: AssetsComponent;
  let fixture: ComponentFixture<AssetsComponent>;
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
  const mockReportingObligation = {
    qualificationType: 'QUALIFY',
    noQualificationReason: 'no reason',
    reportingObligationDetails: {
      qualificationReasonType: 'TURNOVER_MORE_THAN_44M',
      energyResponsibilityType: 'RESPONSIBLE',
      complianceRouteDistribution: {
        iso50001Pct: 50,
        displayEnergyCertificatePct: 25,
        greenDealAssessmentPct: 25,
        energyAuditsPct: 0,
        energyNotAuditedPct: 0,
        totalPct: 100,
      },
    },
  };

  class Page extends BasePage<AssetsComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get iso50001(): string {
      return this.getInputValue('#iso50001');
    }

    set iso50001(value: string) {
      this.setInputValue('#iso50001', value);
    }

    get dec(): string {
      return this.getInputValue('#dec');
    }

    set dec(value: string) {
      this.setInputValue('#dec', value);
    }

    get gda(): string {
      return this.getInputValue('#gda');
    }

    set gda(value: string) {
      this.setInputValue('#gda', value);
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
    fixture = TestBed.createComponent(AssetsComponent);
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

  describe('for new assets details', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          {
            reportingObligation: mockReportingObligation,
          },
          {},
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
      expect(page.heading1.textContent.trim()).toEqual(alternativeComplianceRoutesMap.assets.title);
      expect(page.submitButton).toBeTruthy();
    });

    it('should submit a valid form and navigate to nextRoute', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummaryListContents).toEqual([
        'List the assets and activities',
        'List the assets and activities',
        'List the assets and activities',
      ]);

      page.iso50001 = 'iso2';
      page.dec = 'dec2';
      page.gda = 'gda2';

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.ASSETS,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              assets: {
                iso50001: 'iso2',
                dec: 'dec2',
                gda: 'gda2',
              },
            },
          },
        },
      });
    });
  });

  describe('for existing assets details', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          {
            reportingObligation: mockReportingObligation,
            alternativeComplianceRoutes: mockAlternativeComplianceRoutes,
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
      expect(page.heading1.textContent.trim()).toEqual(alternativeComplianceRoutesMap.assets.title);
      expect(page.iso50001).toEqual('iso1');
      expect(page.dec).toEqual('dec1');
      expect(page.gda).toEqual('gda1');
      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.ASSETS,
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
