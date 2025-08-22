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
import { IncludeUndertakingsComponent } from '@tasks/notification/subtasks/organisation-structure/include-undertakings/include-undertakings.component';
import {
  mockNotificationRequestTask,
  mockOrganisationStructure,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskActionPayload, TasksService } from 'esos-api';

describe('IncludeUndertakingsComponent', () => {
  let component: IncludeUndertakingsComponent;
  let fixture: ComponentFixture<IncludeUndertakingsComponent>;
  let page: Page;
  let store: RequestTaskStore;
  let router: Router;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  class Page extends BasePage<IncludeUndertakingsComponent> {
    get isNonComplyingUndertakingsIncludedRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="isNonComplyingUndertakingsIncluded"]');
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

  describe('for new include undertakings', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild({
          organisationStructure: {
            isHighestParent: true,
          },
        }),
      );

      fixture = TestBed.createComponent(IncludeUndertakingsComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should submit and navigate to undertaking-list', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errors.map((error) => error.textContent.trim())).toEqual([
        `Select yes if the responsible undertaking’s group include any undertakings on 31 December 2022 which either disaggregated from, or ceased to be part of the participant before 5 June 2024 and which are not complying as if they were still a member of the participant`,
      ]);

      page.isNonComplyingUndertakingsIncludedRadios[0].click();

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
              isNonComplyingUndertakingsIncluded: true,
            },
          },
          nocSectionsCompleted: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
            organisationStructure: TaskItemStatus.IN_PROGRESS,
          },
        } as RequestTaskActionPayload,
      });

      expect(navigateSpy).toHaveBeenCalledWith(['../undertaking-list'], { relativeTo: route });
    });
  });

  describe('when edit include-undertakings', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { organisationStructure: mockOrganisationStructure },
          { organisationStructure: TaskItemStatus.IN_PROGRESS },
        ),
      );

      fixture = TestBed.createComponent(IncludeUndertakingsComponent);
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

      page.isNonComplyingUndertakingsIncludedRadios[1].click();

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
              isNonComplyingUndertakingsIncluded: false,
              organisationUndertakingDetails: undefined,
            },
          },
          nocSectionsCompleted: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
            organisationStructure: TaskItemStatus.IN_PROGRESS,
          },
        } as RequestTaskActionPayload,
      });

      expect(navigateSpy).toHaveBeenCalledWith(['../list'], { relativeTo: route });
    });
  });
});
