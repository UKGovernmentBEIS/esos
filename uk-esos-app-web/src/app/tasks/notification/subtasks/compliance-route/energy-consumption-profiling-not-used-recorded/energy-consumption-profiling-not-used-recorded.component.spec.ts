import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockComplianceRoute, mockNotificationRequestTask } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { NocP3 } from 'esos-api';

import { EnergyConsumptionProfilingNotUsedRecordedComponent } from './energy-consumption-profiling-not-used-recorded.component';

describe('EnergyConsumptionProfilingNotUsedRecordedComponent', () => {
  let component: EnergyConsumptionProfilingNotUsedRecordedComponent;
  let fixture: ComponentFixture<EnergyConsumptionProfilingNotUsedRecordedComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          complianceRoute: mockComplianceRoute,
        } as NocP3,
      };
    },
  };

  class Page extends BasePage<EnergyConsumptionProfilingNotUsedRecordedComponent> {
    get heading(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }
    get isEnergyConsumptionProfilingNotUsedRecordedRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="isEnergyConsumptionProfilingNotUsedRecorded"]');
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

    fixture = TestBed.createComponent(EnergyConsumptionProfilingNotUsedRecordedComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all elements and no errors', () => {
    expect(page.errorSummary).toBeFalsy();
    expect(page.heading).toBeTruthy();
    expect(page.heading.textContent.trim()).toEqual(
      'Does the evidence pack record the extent to which, and the reasons why, energy consumption profiling was not used in the energy audit and the details of the alternative method of analysis used?',
    );
    expect(page.submitButton).toBeTruthy();
  });

  it('should show errors if no option is selected', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errors.map((error) => error.textContent.trim())).toEqual(['Select an option']);
    expect(taskServiceSpy).not.toHaveBeenCalled();
  });

  it('should submit and navigate to next page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.isEnergyConsumptionProfilingNotUsedRecordedRadios[0].click();
    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'complianceRoute',
      currentStep: 'energyConsumptionProfilingNotUsedRecorded',
      route: route,
      payload: {
        noc: {
          complianceRoute: {
            ...mockComplianceRoute,
            isEnergyConsumptionProfilingNotUsedRecorded: 'YES',
          },
        },
      },
    });
  });
});
