import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockComplianceRoute, mockNotificationRequestTask } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { TwelveMonthsVerifiableDataComponent } from './twelve-months-verifiable-data.component';

describe('TwelveMonthsVerifiableDataComponent', () => {
  let component: TwelveMonthsVerifiableDataComponent;
  let fixture: ComponentFixture<TwelveMonthsVerifiableDataComponent>;
  let store: RequestTaskStore;
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

  class Page extends BasePage<TwelveMonthsVerifiableDataComponent> {
    get heading(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }
    get twelveMonthsVerifiableDataUsedRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="twelveMonthsVerifiableDataUsed"]');
    }
    get conditionalContent() {
      return this.query<HTMLDivElement>('.govuk-radios__conditional');
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

    fixture = TestBed.createComponent(TwelveMonthsVerifiableDataComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all elements, no errors and no conditional content', () => {
    expect(page.errorSummary).toBeFalsy();
    expect(page.heading).toBeTruthy();
    expect(page.heading.textContent.trim()).toEqual(
      'Did this organisation use 12 months verifiable data for the purpose of calculating energy consumption in all of its ESOS energy audits?',
    );
    expect(page.conditionalContent.classList.contains('govuk-radios__conditional--hidden')).toBeTruthy();
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

  it('should select "Not applicable", render conditional content, submit and navigate to next page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.twelveMonthsVerifiableDataUsedRadios[2].click();
    fixture.detectChanges();
    expect(page.conditionalContent.classList.contains('govuk-radios__conditional--hidden')).toBeFalsy();

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'complianceRoute',
      currentStep: 'twelveMonthsVerifiableData',
      route: route,
      payload: {
        noc: {
          complianceRoute: {
            ...mockComplianceRoute,
            twelveMonthsVerifiableDataUsed: 'NOT_APPLICABLE',
          },
        },
      },
    });
  });
});
