import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  mockNotificationRequestTask,
  mockResponsibleUndertaking,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { OverseasParentDetailsComponent } from './overseas-parent-details.component';

describe('OverseasParentDetailsComponent', () => {
  let component: OverseasParentDetailsComponent;
  let fixture: ComponentFixture<OverseasParentDetailsComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          responsibleUndertaking: mockResponsibleUndertaking,
        } as any,
      };
    },
  };

  class Page extends BasePage<OverseasParentDetailsComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get name() {
      return this.getInputValue('#name');
    }

    set name(value: string) {
      this.setInputValue('#name', value);
    }

    get tradingName() {
      return this.getInputValue('#tradingName');
    }

    set tradingName(value: string) {
      this.setInputValue('#tradingName', value);
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get errorSummaryListContents(): string[] {
      return Array.from(this.errorSummary.querySelectorAll<HTMLAnchorElement>('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(OverseasParentDetailsComponent);
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

  describe('for new overseas parent details', () => {
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
      expect(page.heading1.textContent.trim()).toEqual('Enter the name of the overseas parent company');
      expect(page.submitButton).toBeTruthy();
    });

    it('should display error on empty form submit', () => {
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummaryListContents.length).toEqual(1);
      expect(page.errorSummaryListContents).toEqual(['Enter the name of the parent company']);
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.name = 'Test name';
      page.tradingName = 'Test trading name';
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: 'responsibleUndertaking',
        currentStep: 'overseasParentDetails',
        route: route,
        payload: {
          noc: {
            responsibleUndertaking: {
              ...mockResponsibleUndertaking,
              overseasParentDetails: {
                name: 'Test name',
                tradingName: 'Test trading name',
              },
            },
          },
        },
      });
    });
  });

  describe('for existing overseas parent details', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { responsibleUndertaking: mockResponsibleUndertaking },
          { responsibleUndertaking: TaskItemStatus.IN_PROGRESS },
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
      expect(page.heading1.textContent.trim()).toEqual('Enter the name of the overseas parent company');
      expect(page.name).toEqual('Parent company name');
      expect(page.tradingName).toEqual('Parent company trading name');
      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: 'responsibleUndertaking',
        currentStep: 'overseasParentDetails',
        route: route,
        payload: {
          noc: {
            responsibleUndertaking: mockResponsibleUndertaking,
          },
        },
      });
    });
  });
});
