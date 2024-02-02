import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockOrganisationStructure, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { BasePage, MockType } from '@testing';

import { OrganisationStructureSummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: OrganisationStructureSummaryComponent;
  let fixture: ComponentFixture<OrganisationStructureSummaryComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRoute();
  route.snapshot = new ActivatedRouteSnapshot();
  route.snapshot.queryParams = { page: 1 };

  const taskService: MockType<NotificationService> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          organisationStructure: mockOrganisationStructure,
        } as any,
        nocSectionsCompleted: { organisationStructure: 'COMPLETED' },
      };
    },
  };

  class Page extends BasePage<OrganisationStructureSummaryComponent> {
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="button"]');
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
    store.setState(
      mockStateBuild(
        { organisationStructure: mockOrganisationStructure },
        { organisationStructure: 'IN_PROGRESS' as any },
      ),
    );

    fixture = TestBed.createComponent(OrganisationStructureSummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit and navigate to list page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'organisationStructure',
      currentStep: 'summary',
      route,
      payload: {
        noc: {
          organisationStructure: mockOrganisationStructure,
        },
        nocSectionsCompleted: { organisationStructure: 'COMPLETED' },
      },
    });
  });
});
