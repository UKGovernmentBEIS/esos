import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { HouseCompanyDetailsService } from '@shared/services/house-company-details-service/house-company-details.service';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { OrganisationRegistrationNumberComponent } from '@tasks/notification/subtasks/responsible-undertaking/organisation-registration-number/organisation-registration-number.component';
import {
  mockNotificationRequestTask,
  mockResponsibleUndertaking,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { CompanyProfileDTO } from 'esos-api';

describe('OrganisationRegistrationNumberComponent', () => {
  let component: OrganisationRegistrationNumberComponent;
  let fixture: ComponentFixture<OrganisationRegistrationNumberComponent>;
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

  const houseCompanyDetailsService: MockType<HouseCompanyDetailsService> = {
    checkCompanyReferenceNumber: jest.fn().mockReturnValue(of(null)),
    getCompanyProfile: jest.fn().mockReturnValue(
      of({
        name: 'SANDBOX LIMITED',
        registrationNumber: 'AB654321',
        address: {
          line1: '60 The Grove',
          line2: 'Palmers Green',
          city: 'London',
          postcode: 'N13 5JR',
        },
        sicCodes: ['62090'],
      } as CompanyProfileDTO),
    ),
  };

  class Page extends BasePage<OrganisationRegistrationNumberComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get registrationNumberExistRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="registrationNumberExist"]');
    }

    get registrationNumber() {
      return this.getInputValue('#registrationNumber');
    }

    set registrationNumber(value: string) {
      this.setInputValue('#registrationNumber', value);
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
    fixture = TestBed.createComponent(OrganisationRegistrationNumberComponent);
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
        { provide: HouseCompanyDetailsService, useValue: houseCompanyDetailsService },
      ],
    });
  });

  describe('for new registration number', () => {
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
      expect(page.heading1.textContent.trim()).toEqual('Is the UK organisation registered at Companies House?');
      expect(page.submitButton).toBeTruthy();
    });

    it('should submit a valid form with prefilled data and navigate to nextRoute', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: 'responsibleUndertaking',
        currentStep: 'registrationNumber',
        route: route,
        payload: {
          noc: {
            responsibleUndertaking: {
              ...mockResponsibleUndertaking,
              organisationDetails: {
                ...mockResponsibleUndertaking.organisationDetails,
                registrationNumberExist: true,
                registrationNumber: '11112222',
              },
            },
          },
        },
      });
    });

    it(`if registrationNumber is invalid should display error message and not submit the form`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.registrationNumberExistRadios[0].click();
      page.registrationNumber = '654321';
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummary.textContent).toContain('The registration number must be 8 characters');
      expect(page.errorSummary.textContent).toContain(
        'If your Company Registration Number has fewer than 8 numbers, add zeroes at the start',
      );

      page.registrationNumber = '987654321';
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummary.textContent.trim()).toBe('There is a problem The registration number must be 8 characters');

      expect(taskServiceSpy).toHaveBeenCalledTimes(0);
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.registrationNumberExistRadios[0].click();
      page.registrationNumber = 'AB654321';

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: 'responsibleUndertaking',
        currentStep: 'registrationNumber',
        route: route,
        payload: {
          noc: {
            responsibleUndertaking: {
              ...mockResponsibleUndertaking,
              organisationDetails: {
                ...mockResponsibleUndertaking.organisationDetails,
                registrationNumberExist: true,
                registrationNumber: 'AB654321',
                name: 'SANDBOX LIMITED',
                line1: '60 The Grove',
                line2: 'Palmers Green',
                postcode: 'N13 5JR',
              },
            },
          },
        },
      });
    });
  });

  describe('for existing registration number', () => {
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
      expect(page.heading1.textContent.trim()).toEqual('Is the UK organisation registered at Companies House?');
      expect(page.registrationNumber).toEqual('AB123456');
      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: 'responsibleUndertaking',
        currentStep: 'registrationNumber',
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
