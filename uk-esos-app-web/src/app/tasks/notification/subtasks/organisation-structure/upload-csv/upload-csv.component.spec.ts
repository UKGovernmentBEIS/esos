import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
} from '@tasks/notification/subtasks/organisation-structure/organisation-structure.helper';
import { organisationStructureCsvMap } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';
import { mockOrganisationStructure, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';
import Papa from 'papaparse';

import { NocP3 } from 'esos-api';

import { UploadCsvComponent } from './upload-csv.component';

const mockSuccessPapaResult = {
  data: [
    {
      'Organisation Name': 'Company A',
      'Registration Number (if exists, otherwise leave the cell blank)': 'AC123456',
      'Is this organisation part of an arrangement where 2 or more highest UK parent groups are complying as one participant?':
        true,
      'Has this organisation ceased to be part of the highest parent group or participant since the qualification date but agreed to comply as if it were still a member?':
        false,
      'Is this organisation a franchisee?': true,
      'Is this organisation a parent of the responsible undertaking?': false,
      'Is this organisation a subsidiary of the responsible undertaking?': true,
      'Is the Code same as RU?': false,
      'Select classification type if the organisation covered in this NOC': 'OTHER',
      'Classification name (if other than SIC)': 'ClassificationNameA',
      'Code 1': '1111',
      'Code 2 (Optional)': '2222',
      'Code 3 (Optional)': '3333',
      'Code 4 (Optional)': '4444',
    },
  ],
  errors: [],
  meta: {
    fields: Object.values(organisationStructureCsvMap),
  },
} as Papa.ParseResult<any>;

const mockErrorPapaResult = {
  data: [
    {
      'Organisation Name': null,
      'Registration Number (if exists, otherwise leave the cell blank)': null,
      'Is this organisation covered in this notification?': null,
      'Is this organisation part of an arrangement where 2 or more highest UK parent groups are complying as one participant?':
        null,
      'Is this organisation a parent of the responsible undertaking?': null,
      'Is this organisation a subsidiary of the responsible undertaking?': null,
      'Is this organisation part of a franchise group?': null,
      'Has this organisation ceased to be a part of the corporate group between 31 December 2022 and 5 June 2024?':
        null,
    },
  ],
  errors: [],
  meta: {
    fields: Object.values(organisationStructureCsvMap),
  },
} as Papa.ParseResult<any>;

describe('UploadCsvComponent', () => {
  let component: UploadCsvComponent;
  let fixture: ComponentFixture<UploadCsvComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          organisationStructure: mockOrganisationStructure,
        } as NocP3,
      };
    },
  };

  class Page extends BasePage<UploadCsvComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get paragraphs(): HTMLParagraphElement[] {
      return this.queryAll<HTMLParagraphElement>('p.govuk-body');
    }

    get errorSummaryListContents(): string[] {
      return Array.from(this.errorSummary.querySelectorAll<HTMLAnchorElement>('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get errorTitles() {
      return this.queryAll<HTMLParagraphElement>('.govuk-error-summary__list li p');
    }

    get uploadFileButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button.govuk-button--secondary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
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
        { organisationStructure: TaskItemStatus.IN_PROGRESS },
      ),
    );
    fixture = TestBed.createComponent(UploadCsvComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements and form with 0 errors', () => {
    expect(page.errorSummary).toBeFalsy();
    expect(page.heading1).toBeTruthy();
    expect(page.heading1.textContent.trim()).toEqual(
      "Upload a file with information on the organisations complying as one participant in the responsible undertaking's notification for its corporate group",
    );
    expect(page.paragraphs).toHaveLength(7);
    expect(page.uploadFileButton).toBeTruthy();
    expect(page.submitButton).toBeFalsy();
  });

  it('should display CSV field errors', () => {
    component['processCSVData'](mockErrorPapaResult);
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errorTitles.map((item) => item.textContent.trim())).toEqual([
      "The field 'Organisation Name' has one or more values missing",
      "Check the data in column 'Organisation Name' on rows 1",
      "The field 'Is this organisation part of an arrangement where 2 or more highest UK parent groups are complying as one participant?' has one or more values missing",
      "Check the data in column 'Is this organisation part of an arrangement where 2 or more highest UK parent groups are complying as one participant?' on rows 1",
      "The field 'Has this organisation ceased to be part of the highest parent group or participant since the qualification date but agreed to comply as if it were still a member?' has one or more values missing",
      "Check the data in column 'Has this organisation ceased to be part of the highest parent group or participant since the qualification date but agreed to comply as if it were still a member?' on rows 1",
      "The field 'Is this organisation a franchisee?' has one or more values missing",
      "Check the data in column 'Is this organisation a franchisee?' on rows 1",
      "The field 'Is this organisation a parent of the responsible undertaking?' has one or more values missing",
      "Check the data in column 'Is this organisation a parent of the responsible undertaking?' on rows 1",
      "The field 'Is this organisation a subsidiary of the responsible undertaking?' has one or more values missing",
      "Check the data in column 'Is this organisation a subsidiary of the responsible undertaking?' on rows 1",
      "The field 'Is the Code same as RU?' has one or more values missing",
      "Check the data in column 'Is the Code same as RU?' on rows 1",
    ]);
  });

  it('should not display any error when CSV is valid and submit a valid form', async () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');
    expect(page.errorSummary).toBeFalsy();

    component['processCSVData'](mockSuccessPapaResult);
    fixture.detectChanges();
    expect(page.errorSummary).toBeFalsy();

    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeFalsy();
    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.UPLOAD_CSV,
      route: route,
      payload: {
        noc: {
          organisationStructure: {
            isGroupStructureChartProvided: true,
            isHighestParent: true,
            isNonComplyingUndertakingsIncluded: true,
            organisationUndertakingDetails: [
              {
                organisationName: 'First undertaking',
                registrationNumber: '11111111',
              },
              {
                organisationName: 'Second undertaking',
                registrationNumber: '2222222',
              },
            ],
            organisationsAssociatedWithRU: [
              {
                registrationNumberExist: true,
                registrationNumber: 'AC123456',
                organisationName: 'Company A',
                isPartOfArrangement: true,
                hasCeasedToBePartOfGroup: false,
                isPartOfFranchise: true,
                isParentOfResponsibleUndertaking: false,
                isSubsidiaryOfResponsibleUndertaking: true,
                classificationCodesDetails: {
                  areSameAsRU: false,
                  codes: {
                    codes: ['1111', '2222', '3333', '4444'],
                    otherTypeName: 'ClassificationNameA',
                    type: 'OTHER',
                  },
                },
              },
            ],
          },
        },
      },
    });
  });
});
