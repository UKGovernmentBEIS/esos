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
import { mockAlternativeComplianceRoutes, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<NotificationService> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          alternativeComplianceRoutes: mockAlternativeComplianceRoutes,
        } as any,
      };
    },
  };

  class Page extends BasePage<SummaryComponent> {
    get energyConsumptionDetailsComponent() {
      return this.query<HTMLElement>('esos-energy-consumption-details-with-cost-summary-template');
    }

    get energySavingCategoriesComponent() {
      return this.query<HTMLElement>('esos-energy-savings-categories-details-with-cost-summary-template');
    }

    get assetsSummaryComponent() {
      return this.query<HTMLElement>('esos-assets-summary-template');
    }

    get certificateDetailsSummaryComponent() {
      return this.query<HTMLElement>('esos-certificate-details-summary-template');
    }

    get certificateDetailsListComponent() {
      return this.queryAll<HTMLElement>('esos-certificate-details-list-summary-template');
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
        { alternativeComplianceRoutes: mockAlternativeComplianceRoutes },
        { alternativeComplianceRoutes: TaskItemStatus.IN_PROGRESS },
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
    expect(page.energyConsumptionDetailsComponent).toBeTruthy();
    expect(page.energySavingCategoriesComponent).toBeTruthy();
    expect(page.assetsSummaryComponent).toBeTruthy();
    expect(page.certificateDetailsSummaryComponent).toBeTruthy();
    expect(page.certificateDetailsListComponent).toHaveLength(2);
    expect(page.submitButton).toBeTruthy();
  });

  it(`should submit a valid form and navigate to nextRoute`, () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
      currentStep: CurrentStep.SUMMARY,
      route: route,
      payload: {
        noc: {
          alternativeComplianceRoutes: mockAlternativeComplianceRoutes,
        },
      },
    });
  });
});
