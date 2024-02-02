import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockComplianceRoute, mockNotificationRequestTask } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { ProhibitedDisclosingPartsComponent } from './prohibited-disclosing-parts.component';

describe('ProhibitedDisclosingPartsComponent', () => {
  let component: ProhibitedDisclosingPartsComponent;
  let fixture: ComponentFixture<ProhibitedDisclosingPartsComponent>;
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

  class Page extends BasePage<ProhibitedDisclosingPartsComponent> {
    get heading(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }
    get partsProhibitedFromDisclosingTextArea() {
      return this.queryAll<HTMLInputElement>('textarea[name$="partsProhibitedFromDisclosing"]');
    }
    get getPartsProhibitedFromDisclosing(): string {
      return this.getInputValue('#partsProhibitedFromDisclosing');
    }
    set setPartsProhibitedFromDisclosing(value: string) {
      this.setInputValue('#partsProhibitedFromDisclosing', value);
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

    fixture = TestBed.createComponent(ProhibitedDisclosingPartsComponent);
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
      'Explain which parts of the ESOS report, or supporting information, the responsible undertaking is prohibited from disclosing.',
    );
    expect(page.submitButton).toBeTruthy();
  });

  it('should show errors if no option is selected', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errors.map((error) => error.textContent.trim())).toEqual([
      'Enter the parts of the ESOS report (or supporting information) that the responsible undertaking is prohibited from disclosing to the group undertaking',
    ]);
    expect(taskServiceSpy).not.toHaveBeenCalled();
  });

  it('should submit and navigate to next page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.setPartsProhibitedFromDisclosing = 'Some parts';
    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'complianceRoute',
      currentStep: 'prohibitedDisclosingParts',
      route: route,
      payload: {
        noc: {
          complianceRoute: {
            ...mockComplianceRoute,
            partsProhibitedFromDisclosing: 'Some parts',
          },
        },
      },
    });
  });
});
