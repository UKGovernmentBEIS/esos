import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import {
  mockAlternativeComplianceRoutes,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, convertToUTCDate, MockType } from '@testing';

import { Iso50001CertificateDetailsComponent } from './iso-50001-certificate-details.component';

describe('Iso50001CertificateDetailsComponent', () => {
  let component: Iso50001CertificateDetailsComponent;
  let fixture: ComponentFixture<Iso50001CertificateDetailsComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          alternativeComplianceRoutes: mockAlternativeComplianceRoutes,
        } as any,
      };
    },
  };
  const mockValidFrom = new Date('2022-01-01');
  const mockValidUntil = new Date('2024-01-01');

  class Page extends BasePage<Iso50001CertificateDetailsComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get certificateNumber(): string {
      return this.getInputValue('#certificateNumber');
    }

    set certificateNumber(value: string) {
      this.setInputValue('#certificateNumber', value);
    }

    get validFrom() {
      return this.getDateInputValue('#validFrom');
    }

    set validFrom(value: Date) {
      this.setDateInputValue('#validFrom', value);
    }

    get validUntil() {
      return this.getDateInputValue('#validUntil');
    }

    set validUntil(value: Date) {
      this.setDateInputValue('#validUntil', value);
    }

    get errorSummaryListContents(): string[] {
      return Array.from(this.errorSummary.querySelectorAll<HTMLAnchorElement>('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(Iso50001CertificateDetailsComponent);
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

  describe('for new iso 50001 certificate details', () => {
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
      expect(page.heading1.textContent.trim()).toEqual(alternativeComplianceRoutesMap.iso50001CertificateDetails.title);
      expect(page.submitButton).toBeTruthy();
    });

    it('should display an error if the valid until date is before 2023-12-05', () => {
      page.validFrom = mockValidFrom;
      page.validUntil = new Date('2023-12-04');
      page.certificateNumber = 'iso5001-1';
      page.submitButton.click();
      fixture.detectChanges();
      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummaryListContents).toEqual(['Valid until date must be the same as or after 5 December 2023']);
    });

    it('should display an error if the valid from date is after 2024-06-05', () => {
      page.validFrom = new Date('2024-06-06');
      page.validUntil = new Date('2024-08-21');
      page.certificateNumber = 'iso5001-1';
      page.submitButton.click();
      fixture.detectChanges();
      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummaryListContents).toContain('Valid from date must be the same as or before 5 June 2024');
    });

    it('should submit a valid form and navigate to nextRoute', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      page.certificateNumber = 'iso1';
      page.validFrom = mockValidFrom;
      page.validUntil = mockValidUntil;

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.ISO_50001_CERTIFICATE_DETAILS,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              iso50001CertificateDetails: {
                certificateNumber: 'iso1',
                validFrom: mockValidFrom,
                validUntil: mockValidUntil,
              },
            },
          },
        },
      });
    });

    it('should show errors when not all fields are filled', () => {
      page.validFrom = mockValidFrom;

      fixture.detectChanges();
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();

      expect(page.errorSummaryListContents).toEqual(['', 'Enter an ISO 50001 Certificate number', 'Enter a date']);
    });

    it('should not show errors when all fields are filled or all fields are empty', () => {
      page.certificateNumber = 'dec1';
      page.validFrom = mockValidFrom;
      page.validUntil = mockValidUntil;

      fixture.detectChanges();
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
    });
  });

  describe('for existing iso 50001 certificate details', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { alternativeComplianceRoutes: mockAlternativeComplianceRoutes },
          { alternativeComplianceRoutes: TaskItemStatus.IN_PROGRESS },
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
      expect(page.heading1.textContent.trim()).toEqual(alternativeComplianceRoutesMap.iso50001CertificateDetails.title);
      expect(page.certificateNumber).toEqual('iso1');
      expect(page.validFrom).toEqual(convertToUTCDate(mockValidFrom));
      expect(page.validUntil).toEqual(convertToUTCDate(mockValidUntil));
      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.ISO_50001_CERTIFICATE_DETAILS,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              iso50001CertificateDetails: {
                ...mockAlternativeComplianceRoutes.iso50001CertificateDetails,
                validFrom: mockValidFrom,
                validUntil: mockValidUntil,
              },
            },
          },
        },
      });
    });
  });
});
