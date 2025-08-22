import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockContactPersons, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { ContactPersons, NocP3 } from 'esos-api';

import { ContactPersonsSummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: ContactPersonsSummaryComponent;
  let fixture: ComponentFixture<ContactPersonsSummaryComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const contactPersons: ContactPersons = {
    ...mockContactPersons,
    primaryContact: {
      ...mockContactPersons.primaryContact,
      email: 'johndoe@mail.com',
    },
    secondaryContact: {
      ...mockContactPersons.secondaryContact,
      email: 'janedoe@mail.com',
    },
  };

  const route = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          contactPersons: contactPersons,
        } as NocP3,
        nocSectionsCompleted: { contactPersons: 'COMPLETED' },
      };
    },
  };

  class Page extends BasePage<ContactPersonsSummaryComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [row.querySelector('dt'), row.querySelectorAll('dd')[0], row.querySelectorAll('dd')[1]])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
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
    store.setState(mockStateBuild({ contactPersons }, { contactPersons: TaskItemStatus.IN_PROGRESS }));

    fixture = TestBed.createComponent(ContactPersonsSummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the summary details', () => {
    expect(page.summaryListValues).toEqual([
      ['First name', 'John', 'Change'],
      ['Last name', 'Doe', 'Change'],
      ['Job title', 'Job title', 'Change'],
      ['Email address', 'johndoe@mail.com', 'Change'],
      ['Address', 'Line', 'Change'],
      ['Town or city', 'City', 'Change'],
      ['County', 'County', 'Change'],
      ['Postcode', 'Postcode', 'Change'],
      ['Phone number 1', 'UK (44) 1234567890', 'Change'],
      ['Phone number 2', '', 'Change'],
      ['First name', 'Jane', 'Change'],
      ['Last name', 'Doe', 'Change'],
      ['Job title', 'Job title', 'Change'],
      ['Email address', 'janedoe@mail.com', 'Change'],
      ['Address', 'Line', 'Change'],
      ['Town or city', 'City', 'Change'],
      ['County', 'County', 'Change'],
      ['Postcode', 'Postcode', 'Change'],
      ['Phone number 1', 'UK (44) 1234567890', 'Change'],
      ['Phone number 2', '', 'Change'],
    ]);
  });

  it('should submit and navigate to next route', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'contactPersons',
      currentStep: 'summary',
      route,
      payload: {
        noc: {
          contactPersons,
        },
        nocSectionsCompleted: { contactPersons: 'COMPLETED' },
      },
    });
  });
});
