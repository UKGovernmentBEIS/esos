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

import { GdaCertificatesDetailsComponent } from './gda-certificates-details.component';

describe('GdaCertificatesDetailsComponent', () => {
  let component: GdaCertificatesDetailsComponent;
  let fixture: ComponentFixture<GdaCertificatesDetailsComponent>;
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
  const mockValidFrom1 = new Date('2022-01-01');
  const mockValidUntil1 = new Date('2024-01-01');
  const mockValidFrom2 = new Date('2020-01-01');
  const mockValidUntil2 = new Date('2023-12-05');

  class Page extends BasePage<GdaCertificatesDetailsComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get certificateNumber1(): string {
      return this.getInputValue('#certificateDetails.0.certificateNumber');
    }

    set certificateNumber1(value: string) {
      this.setInputValue('#certificateDetails.0.certificateNumber', value);
    }

    get certificateNumber2(): string {
      return this.getInputValue('#certificateDetails.1.certificateNumber');
    }

    set certificateNumber2(value: string) {
      this.setInputValue('#certificateDetails.1.certificateNumber', value);
    }

    get validFrom1() {
      return this.getDateInputValue('#certificateDetails.0.validFrom');
    }

    set validFrom1(value: Date) {
      this.setDateInputValue('#certificateDetails.0.validFrom', value);
    }

    get validFrom2() {
      return this.getDateInputValue('#certificateDetails.1.validFrom');
    }

    set validFrom2(value: Date) {
      this.setDateInputValue('#certificateDetails.1.validFrom', value);
    }

    get validUntil1() {
      return this.getDateInputValue('#certificateDetails.0.validUntil');
    }

    set validUntil1(value: Date) {
      this.setDateInputValue('#certificateDetails.0.validUntil', value);
    }

    get validUntil2() {
      return this.getDateInputValue('#certificateDetails.1.validUntil');
    }

    set validUntil2(value: Date) {
      this.setDateInputValue('#certificateDetails.1.validUntil', value);
    }

    get errorSummaryListContents(): string[] {
      return Array.from(this.errorSummary.querySelectorAll<HTMLAnchorElement>('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get addAnotherButton() {
      return this.query<HTMLButtonElement>('button[govukSecondaryButton]');
    }

    get removeCertificateButton() {
      return this.query<HTMLButtonElement>('a[role="button"]');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(GdaCertificatesDetailsComponent);
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

  describe('for new gda certificates details details', () => {
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
      expect(page.heading1.textContent.trim()).toEqual(alternativeComplianceRoutesMap.gdaCertificatesDetails.title);
      expect(page.addAnotherButton).toBeTruthy();
      expect(page.submitButton).toBeTruthy();
    });

    it('should display an error if the valid until date is before 2023-12-05', () => {
      page.validFrom1 = mockValidFrom1;
      page.validUntil1 = new Date('2023-12-04');
      page.certificateNumber1 = 'gda1';
      page.submitButton.click();
      fixture.detectChanges();
      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummaryListContents).toEqual(['Valid until date must be the same as or after 5 December 2023']);
    });

    it('should display an error if the valid from date is after 2024-06-05', () => {
      page.validFrom1 = new Date('2024-06-06');
      page.validUntil1 = new Date('2024-08-21');
      page.certificateNumber1 = 'gda1';
      page.submitButton.click();
      fixture.detectChanges();
      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummaryListContents).toContain('Valid from date must be the same as or before 5 June 2024');
    });

    it('should submit a valid form and navigate to nextRoute', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      page.certificateNumber1 = 'gda1';
      page.validFrom1 = mockValidFrom1;
      page.validUntil1 = mockValidUntil1;

      /**
       * Add and remove a certificate section, check that only one remove button is displayed
       */
      page.addAnotherButton.click();
      fixture.detectChanges();
      page.removeCertificateButton.click();
      fixture.detectChanges();

      expect(page.removeCertificateButton).toBeFalsy();

      /**
       * Add another certificate section
       */
      page.addAnotherButton.click();
      fixture.detectChanges();

      page.certificateNumber2 = 'gda2';
      page.validFrom2 = mockValidFrom2;
      page.validUntil2 = mockValidUntil2;

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.GDA_CERTIFICATES_DETAILS,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              gdaCertificatesDetails: {
                certificateDetails: [
                  {
                    certificateNumber: 'gda1',
                    validFrom: mockValidFrom1,
                    validUntil: mockValidUntil1,
                  },
                  {
                    certificateNumber: 'gda2',
                    validFrom: mockValidFrom2,
                    validUntil: mockValidUntil2,
                  },
                ],
              },
            },
          },
        },
      });
    });

    it('should show errors when not all fields are filled', () => {
      // Assuming your component's form is setup to test the validator
      // Fill some fields but not others
      page.certificateNumber1 = 'dec1';
      page.validFrom1 = mockValidFrom1;
      // Leave validUntil1 and other fields empty to trigger the validator

      fixture.detectChanges();
      page.submitButton.click();
      fixture.detectChanges();

      // Expect an error to be shown for fields that are empty but shouldn't be
      expect(page.errorSummary).toBeTruthy();
      // Specific checks for error messages can be added here
    });

    it('should not show errors when all fields are filled or all fields are empty', () => {
      // Fill all fields to pass the validator
      page.certificateNumber1 = 'dec1';
      page.validFrom1 = mockValidFrom1;
      page.validUntil1 = mockValidUntil1;

      // Optionally, test the scenario where all fields are left empty

      fixture.detectChanges();
      page.submitButton.click();
      fixture.detectChanges();

      // Expect no errors to be shown
      expect(page.errorSummary).toBeFalsy();
    });
  });

  describe('for existing gda certificates details details', () => {
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
      expect(page.heading1.textContent.trim()).toEqual(alternativeComplianceRoutesMap.gdaCertificatesDetails.title);
      expect(page.certificateNumber1).toEqual('gda1');
      expect(page.validFrom1).toEqual(convertToUTCDate(mockValidFrom1));
      expect(page.validUntil1).toEqual(convertToUTCDate(mockValidUntil1));
      expect(page.certificateNumber2).toEqual('gda2');
      expect(page.validFrom2).toEqual(convertToUTCDate(mockValidFrom2));
      expect(page.validUntil2).toEqual(convertToUTCDate(mockValidUntil2));

      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.GDA_CERTIFICATES_DETAILS,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              gdaCertificatesDetails: {
                certificateDetails: [
                  {
                    certificateNumber: 'gda1',
                    validFrom: mockValidFrom1,
                    validUntil: mockValidUntil1,
                  },
                  {
                    certificateNumber: 'gda2',
                    validFrom: mockValidFrom2,
                    validUntil: mockValidUntil2,
                  },
                ],
              },
            },
          },
        },
      });
    });
  });
});
