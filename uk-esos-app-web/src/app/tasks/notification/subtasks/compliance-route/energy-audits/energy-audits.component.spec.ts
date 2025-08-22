import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  mockComplianceRoute,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { EnergyAuditsComponent } from './energy-audits.component';

describe('EnergyAuditsComponent', () => {
  let component: EnergyAuditsComponent;
  let fixture: ComponentFixture<EnergyAuditsComponent>;
  let store: RequestTaskStore;
  let router: Router;
  let page: Page;

  const route = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          complianceRoute: mockComplianceRoute,
        } as any,
      };
    },
  };

  class Page extends BasePage<EnergyAuditsComponent> {
    get heading(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }
    get internalHeading(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h3');
    }
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
    get addButton() {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
    get errorSummary() {
      return this.query<HTMLDivElement>('govuk-error-summary');
    }
    get errors() {
      return this.queryAll<HTMLLIElement>('ul.govuk-error-summary__list > li');
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
    store.setState(mockNotificationRequestTask);
    store.setState(mockStateBuild({ complianceRoute: mockComplianceRoute }, { complianceRoute: 'IN_PROGRESS' as any }));

    fixture = TestBed.createComponent(EnergyAuditsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all elements and no errors', () => {
    expect(page.errorSummary).toBeFalsy();
    expect(page.heading).toBeTruthy();
    expect(page.heading.textContent.trim()).toEqual('Add an energy audit');
    expect(page.internalHeading.textContent.trim()).toEqual('Energy audits added');
    expect(page.addButton).toBeTruthy();
    expect(page.submitButton).toBeTruthy();
  });

  it('should navigate to add page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    page.addButton.click();

    expect(navigateSpy).toHaveBeenCalledWith(['../', 'add-energy-audit'], { relativeTo: route });
  });

  it('should submit and navigate to next page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'complianceRoute',
      currentStep: 'energyAudits',
      route: route,
      payload: {
        noc: {
          complianceRoute: {
            ...mockComplianceRoute,
          },
        },
      },
    });
  });
});
