import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { RequestTaskStore } from '@common/request-task/+state';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';
import { HighestParentComponent } from '@tasks/notification/subtasks/organisation-structure/highest-parent/highest-parent.component';
import {
  mockNotificationRequestTask,
  mockOrganisationStructure,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskActionPayload, TasksService } from 'esos-api';

describe('HighestParentComponent', () => {
  let component: HighestParentComponent;
  let fixture: ComponentFixture<HighestParentComponent>;
  let page: Page;
  let store: RequestTaskStore;
  let router: Router;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  class Page extends BasePage<HighestParentComponent> {
    get isHighestParentRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="isHighestParent"]');
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
        provideNotificationTaskServices(),
        provideNotificationSideEffects(),
        provideNotificationStepFlowManagers(),
        SideEffectsHandler,
        RequestTaskStore,
        HttpClient,
        HttpHandler,
        { provide: ActivatedRoute, useValue: route },
        { provide: TasksService, useValue: tasksService },
      ],
    });
  });

  describe('for new highest parent', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(mockStateBuild({ organisationStructure: undefined }));

      fixture = TestBed.createComponent(HighestParentComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should submit and navigate to include-undertakings', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errors.map((error) => error.textContent.trim())).toEqual([
        `Select yes if the responsible undertaking is a highest UK parent which has agreed in writing to aggregate with one or more other highest UK parents in its corporate group, so that their highest UK parent groups can comply as one participant`,
      ]);

      page.isHighestParentRadios[0].click();

      page.submitButton.click();
      fixture.detectChanges();

      expect(tasksService.processRequestTaskAction).toHaveBeenCalledWith({
        requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT',
        requestTaskId: 2,
        requestTaskActionPayload: {
          payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
          noc: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
            organisationStructure: {
              isHighestParent: true,
            },
          },
          nocSectionsCompleted: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
            organisationStructure: TaskItemStatus.IN_PROGRESS,
          },
        } as RequestTaskActionPayload,
      });

      expect(navigateSpy).toHaveBeenCalledWith(['../include-undertakings'], { relativeTo: route });
    });
  });

  describe('when edit highest parent', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { organisationStructure: mockOrganisationStructure },
          { organisationStructure: TaskItemStatus.IN_PROGRESS },
        ),
      );

      fixture = TestBed.createComponent(HighestParentComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should submit and navigate to include-undertakings', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.isHighestParentRadios[1].click();

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(tasksService.processRequestTaskAction).toHaveBeenCalledWith({
        requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT',
        requestTaskId: 2,
        requestTaskActionPayload: {
          payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
          noc: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
            organisationStructure: {
              ...mockOrganisationStructure,
              isHighestParent: false,
            },
          },
          nocSectionsCompleted: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
            organisationStructure: TaskItemStatus.IN_PROGRESS,
          },
        } as RequestTaskActionPayload,
      });

      expect(navigateSpy).toHaveBeenCalledWith(['../include-undertakings'], { relativeTo: route });
    });
  });
});
