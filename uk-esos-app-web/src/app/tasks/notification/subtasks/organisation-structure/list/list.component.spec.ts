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
import {
  mockNotificationRequestTask,
  mockOrganisationStructure,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskActionPayload, TasksService } from 'esos-api';

import { OrganisationStructureListComponent } from './list.component';

describe('ListComponent', () => {
  let component: OrganisationStructureListComponent;
  let fixture: ComponentFixture<OrganisationStructureListComponent>;
  let store: RequestTaskStore;
  let router: Router;
  let page: Page;

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  const route = new ActivatedRouteStub(null, { page: 1 });

  class Page extends BasePage<OrganisationStructureListComponent> {
    get buttons() {
      return this.queryAll<HTMLButtonElement>('a[type="button"]');
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }

    get errorSummary() {
      return this.query<HTMLDivElement>('govuk-error-summary');
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

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { organisationStructure: mockOrganisationStructure },
        { organisationStructure: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(OrganisationStructureListComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to add page', () => {
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');
    page.buttons[0].click();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to upload csv', () => {
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');
    page.buttons[1].click();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should submit and navigate to summary', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

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
          organisationStructure: mockOrganisationStructure,
        },
        nocSectionsCompleted: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
          organisationStructure: TaskItemStatus.IN_PROGRESS,
        },
      } as RequestTaskActionPayload,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: route });
  });
});
