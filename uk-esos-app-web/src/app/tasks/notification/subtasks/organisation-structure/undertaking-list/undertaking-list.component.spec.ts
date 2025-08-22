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
import { UndertakingListComponent } from '@tasks/notification/subtasks/organisation-structure/undertaking-list/undertaking-list.component';
import {
  mockNotificationRequestTask,
  mockOrganisationStructure,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskActionPayload, TasksService } from 'esos-api';

describe('UndertakingListComponent', () => {
  let component: UndertakingListComponent;
  let fixture: ComponentFixture<UndertakingListComponent>;
  let page: Page;
  let store: RequestTaskStore;
  let router: Router;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  class Page extends BasePage<UndertakingListComponent> {
    set firstOrganisationName(value: string) {
      this.setInputValue('#organisations.0.organisationName', value);
    }

    set firstRegistrationNumber(value: string) {
      this.setInputValue('#organisations.0.registrationNumber', value);
    }

    set thirdOrganisationName(value: string) {
      this.setInputValue('#organisations.2.organisationName', value);
    }

    set thirdRegistrationNumber(value: string) {
      this.setInputValue('#organisations.2.registrationNumber', value);
    }

    get removeButtons() {
      return this.queryAll<HTMLLinkElement>('.govuk-link').filter(
        (el) => el.textContent.trim() === 'Remove organisation name',
      );
    }

    get addAnotherButton() {
      return this.query<HTMLButtonElement>('button[govukSecondaryButton]');
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

  describe('for new undertaking list', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild({
          organisationStructure: {
            isHighestParent: true,
            isNonComplyingUndertakingsIncluded: true,
          },
        }),
      );

      fixture = TestBed.createComponent(UndertakingListComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should submit and navigate to list', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errors.map((error) => error.textContent.trim())).toEqual(['Enter organisation name']);

      page.firstOrganisationName = 'First undertaking';
      page.firstRegistrationNumber = '11111111';

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
              organisationUndertakingDetails: [
                {
                  organisationName: 'First undertaking',
                  registrationNumber: '11111111',
                },
              ],
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

  describe('when edit undertaking list', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { organisationStructure: mockOrganisationStructure },
          { organisationStructure: TaskItemStatus.IN_PROGRESS },
        ),
      );

      fixture = TestBed.createComponent(UndertakingListComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should submit and navigate to list', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.firstOrganisationName = 'First undertaking Change';
      page.firstRegistrationNumber = '11111111 Change';

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
              organisationUndertakingDetails: [
                {
                  organisationName: 'First undertaking Change',
                  registrationNumber: '11111111 Change',
                },
                {
                  organisationName: 'Second undertaking',
                  registrationNumber: '2222222',
                },
              ],
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

    it('should remove submit and navigate to list', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.removeButtons[0].click();
      fixture.detectChanges();

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
              organisationUndertakingDetails: [
                {
                  organisationName: 'Second undertaking',
                  registrationNumber: '2222222',
                },
              ],
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

    it('should add new submit and navigate to list', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.addAnotherButton.click();
      fixture.detectChanges();

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errors.map((error) => error.textContent.trim())).toEqual(['Enter organisation name']);

      page.thirdOrganisationName = 'Third undertaking';
      page.thirdRegistrationNumber = '3333333';

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
              ...mockOrganisationStructure,
              organisationUndertakingDetails: [
                {
                  organisationName: 'First undertaking',
                  registrationNumber: '11111111',
                },
                {
                  organisationName: 'Second undertaking',
                  registrationNumber: '2222222',
                },
                {
                  organisationName: 'Third undertaking',
                  registrationNumber: '3333333',
                },
              ],
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
