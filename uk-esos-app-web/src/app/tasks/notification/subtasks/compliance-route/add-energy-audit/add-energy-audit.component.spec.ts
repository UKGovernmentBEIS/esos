import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  mockComplianceRoute,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { BasePage, MockType } from '@testing';

import { AddEnergyAuditComponent } from './add-energy-audit.component';

describe('AddEnergyAuditComponent', () => {
  let component: AddEnergyAuditComponent;
  let fixture: ComponentFixture<AddEnergyAuditComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route: any = { snapshot: { params: { taskId: 1 }, pathFromRoot: [] } };

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

  class Page extends BasePage<AddEnergyAuditComponent> {
    get heading(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }
    get descriptionTextArea() {
      return this.queryAll<HTMLInputElement>('textarea[name$="description"]');
    }
    set setDescription(value: string) {
      this.setInputValue('#description', value);
    }
    get numberOfSitesCoveredTextArea() {
      return this.queryAll<HTMLInputElement>('textarea[name$="numberOfSitesCovered"]');
    }
    set setNumberOfSitesCovered(value: number) {
      this.setInputValue('#numberOfSitesCovered', value);
    }
    get numberOfSitesVisitedTextArea() {
      return this.queryAll<HTMLInputElement>('textarea[name$="numberOfSitesVisited"]');
    }
    set setNumberOfSitesVisited(value: number) {
      this.setInputValue('#numberOfSitesVisited', value);
    }
    get reasonTextArea() {
      return this.queryAll<HTMLInputElement>('textarea[name$="reason"]');
    }
    set setReason(value: string) {
      this.setInputValue('#reason', value);
    }
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
    get errorSummary() {
      return this.query<HTMLDivElement>('govuk-error-summary');
    }
    get errors() {
      return this.queryAll<HTMLLIElement>('ul.govuk-error-summary__list > li');
    }
  }

  const createComponent = () => {
    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNotificationRequestTask);
    store.setState(mockStateBuild({ complianceRoute: mockComplianceRoute }, { complianceRoute: 'IN_PROGRESS' as any }));

    fixture = TestBed.createComponent(AddEnergyAuditComponent);
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

    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all elements and no errors', () => {
    expect(page.errorSummary).toBeFalsy();
    expect(page.heading).toBeTruthy();
    expect(page.heading.textContent.trim()).toEqual('Enter the energy audit details');
    expect(page.submitButton).toBeTruthy();
  });

  it('should show errors if values are not filled', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errors.map((error) => error.textContent.trim())).toEqual([
      'Enter the description',
      'Enter the number of sites visited',
      'Enter the reason',
    ]);
    expect(taskServiceSpy).not.toHaveBeenCalled();
  });

  it('should submit and navigate to next page on add', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.setDescription = 'Test description';
    page.setNumberOfSitesCovered = 10;
    page.setNumberOfSitesVisited = 100000;
    page.setReason = 'Test reason';
    page.submitButton.click();
    fixture.detectChanges();
    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'complianceRoute',
      currentStep: 'addEnergyAudit',
      route: route,
      payload: {
        noc: {
          complianceRoute: {
            ...mockComplianceRoute,
            energyAudits: [
              {
                description: 'desc1',
                numberOfSitesCovered: 5,
                numberOfSitesVisited: 10,
                reason: 'reason1',
              },
              {
                description: 'desc2',
                numberOfSitesVisited: 999,
                reason: 'reason2',
              },
              {
                description: 'Test description',
                numberOfSitesCovered: 10,
                numberOfSitesVisited: 100000,
                reason: 'Test reason',
              },
            ],
          },
        },
      },
    });
    taskServiceSpy.mockClear();
  });

  it('should submit and navigate to next page on edit', () => {
    route.snapshot.params = { taskId: 1, index: 1 };
    createComponent();

    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.setDescription = 'Test description2';
    page.setNumberOfSitesCovered = 123;
    page.setNumberOfSitesVisited = 12345;
    page.setReason = 'Test reason2';
    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'complianceRoute',
      currentStep: 'editEnergyAudit',
      route: route,
      payload: {
        noc: {
          complianceRoute: {
            ...mockComplianceRoute,
            energyAudits: [
              {
                description: 'Test description2',
                numberOfSitesCovered: 123,
                numberOfSitesVisited: 12345,
                reason: 'Test reason2',
              },
              {
                description: 'desc2',
                numberOfSitesVisited: 999,
                reason: 'reason2',
              },
            ],
          },
        },
      },
    });
  });
});
