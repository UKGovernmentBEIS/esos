import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { CountyService } from '@core/services/county.service';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  mockNotificationRequestTask,
  mockResponsibleUndertaking,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { OrganisationDetailsComponent } from './organisation-details.component';

describe('OrganisationDetailsComponent', () => {
  let component: OrganisationDetailsComponent;
  let fixture: ComponentFixture<OrganisationDetailsComponent>;
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

  const countyService: MockType<CountyService> = {
    getUkCounties: jest.fn().mockReturnValue(
      of([
        {
          id: 1,
          name: 'London',
        },
      ]),
    ),
  };

  class Page extends BasePage<OrganisationDetailsComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get organisationName() {
      return this.getInputValue('#name');
    }

    set organisationName(value: string) {
      this.setInputValue('#name', value);
    }

    get type() {
      return this.getInputValue('#type');
    }

    set type(value: string) {
      this.setInputValue('#type', value);
    }

    get otherTypeName() {
      return this.getInputValue('#otherTypeName');
    }

    set otherTypeName(value: string) {
      this.setInputValue('#otherTypeName', value);
    }

    get codes() {
      return this.getInputValue('#codes');
    }

    set codes(codesArray: string[]) {
      codesArray.forEach((value: string, index: number) => {
        this.setInputValue(`#codes.${index}`, value);
      });
    }

    get line1() {
      return this.getInputValue('#line1');
    }

    set line1(value: string) {
      this.setInputValue('#line1', value);
    }

    get line2() {
      return this.getInputValue('#line2');
    }

    set line2(value: string) {
      this.setInputValue('#line2', value);
    }

    get city() {
      return this.getInputValue('#city');
    }

    set city(value: string) {
      this.setInputValue('#city', value);
    }

    get postcode() {
      return this.getInputValue('#postcode');
    }

    set postcode(value: string) {
      this.setInputValue('#postcode', value);
    }

    get county() {
      return this.getInputValue('#county');
    }

    set county(value: string) {
      this.setInputValue('#county', value);
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
    fixture = TestBed.createComponent(OrganisationDetailsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
        { provide: CountyService, useValue: countyService },
      ],
    });
  });

  describe('for new organisation details', () => {
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
      expect(page.heading1.textContent.trim()).toEqual('Enter the organisation details');
      expect(page.submitButton).toBeTruthy();
    });

    it('should submit a valid form with prefilled data and navigate to nextRoute', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: 'responsibleUndertaking',
        currentStep: 'organisationDetails',
        route: route,
        payload: {
          noc: {
            responsibleUndertaking: {
              ...mockResponsibleUndertaking,
              organisationDetails: {
                ...mockResponsibleUndertaking.organisationDetails,
                name: 'Ru Org Name',
                type: 'SIC',
                otherTypeName: undefined,
                codes: ['2222'],
                line1: 'Line 1',
                line2: 'Line 2',
                postcode: 'Postcode',
                city: 'City',
                county: 'Powys',
              },
            },
          },
        },
      });
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.organisationName = 'Organisation name';
      page.line1 = 'Address 1';
      page.line2 = 'Address 2';
      page.city = 'London';
      page.postcode = '33333';
      page.county = 'London';
      page.type = 'SIC';
      page.codes = ['CodeA'];

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: 'responsibleUndertaking',
        currentStep: 'organisationDetails',
        route: route,
        payload: {
          noc: {
            responsibleUndertaking: {
              ...mockResponsibleUndertaking,
              organisationDetails: {
                ...mockResponsibleUndertaking.organisationDetails,
                name: 'Organisation name',
                line1: 'Address 1',
                line2: 'Address 2',
                postcode: '33333',
                city: 'London',
                county: 'London',
                type: 'SIC',
                otherTypeName: undefined,
                codes: ['CodeA'],
              },
            },
          },
        },
      });
    });
  });

  describe('for existing organisation details', () => {
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
      expect(page.heading1.textContent.trim()).toEqual('Enter the organisation details');
      expect(page.organisationName).toEqual('Corporate Legal Entity Account 2');
      expect(page.line1).toEqual('Some address 1');
      expect(page.line2).toEqual('Some address 2');
      expect(page.city).toEqual('London');
      expect(page.county).toEqual('London');
      expect(page.postcode).toEqual('511111');
      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: 'responsibleUndertaking',
        currentStep: 'organisationDetails',
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
