import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockOrganisationStructure, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { BasePage, MockType } from '@testing';

import { OrganisationStructureAddEditComponent } from './add-edit.component';

describe('AddEditComponent', () => {
  let component: OrganisationStructureAddEditComponent;
  let fixture: ComponentFixture<OrganisationStructureAddEditComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route: any = { snapshot: { params: { taskId: 1 }, pathFromRoot: [] } };

  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          organisationStructure: mockOrganisationStructure,
        } as any,
        nocSectionsCompleted: { organisationStructure: 'IN_PROGRESS' },
      };
    },
  };

  const createComponent = () => {
    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { organisationStructure: mockOrganisationStructure },
        { organisationStructure: 'IN_PROGRESS' as any },
      ),
    );

    fixture = TestBed.createComponent(OrganisationStructureAddEditComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  class Page extends BasePage<OrganisationStructureAddEditComponent> {
    get registrationNumberExistRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="registrationNumberExist"]');
    }

    get registrationNumber() {
      return this.getInputValue('#registrationNumber');
    }
    set registrationNumber(value: string) {
      this.setInputValue('#registrationNumber', value);
    }

    get organisationName() {
      return this.getInputValue('#organisationName');
    }
    set organisationName(value: string) {
      this.setInputValue('#organisationName', value);
    }

    get checkboxes() {
      return this.queryAll<HTMLInputElement>('.govuk-checkboxes__input');
    }

    set type(value: string) {
      this.setInputValue('#type', value);
    }

    set code(value: string) {
      this.setInputValue('#codes.0', value);
    }

    get isParentOfResponsibleUndertaking() {
      return this.queryAll<HTMLInputElement>('input[name$="isParentOfResponsibleUndertaking"]');
    }

    get isSubsidiaryOfResponsibleUndertaking() {
      return this.queryAll<HTMLInputElement>('input[name$="isSubsidiaryOfResponsibleUndertaking"]');
    }

    get isPartOfArrangementRadio() {
      return this.queryAll<HTMLInputElement>('input[name$="isPartOfArrangement"]');
    }

    get isPartOfFranchiseRadio() {
      return this.queryAll<HTMLInputElement>('input[name$="isPartOfFranchise"]');
    }

    get hasCeasedToBePartOfGroupRadio() {
      return this.queryAll<HTMLInputElement>('input[name$="hasCeasedToBePartOfGroup"]');
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
        DestroySubject,
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
      ],
    });

    createComponent();
  });

  afterEach(() => {
    taskService.saveSubtask.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show errors', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errors.map((error) => error.textContent.trim())).toEqual([
      'Please select an option',
      'Enter the organisation name',
      'Enter a classification type',
      'Select yes if 2 or more parent groups are complying as one participant',
      'Select yes if this organisation was not part of the corporate group during the compliance period',
      'Select yes if the organisation is part of a franchise group',
      'Select yes if the organisation is a parent of the responsible undertaking',
      'Select yes if the organisation is a subsidiary of the responsible undertaking',
      'Enter a code',
    ]);
    expect(taskServiceSpy).not.toHaveBeenCalled();
  });

  it('should submit with same RU and navigate to next route on add', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');
    const organisation = mockOrganisationStructure.organisationsAssociatedWithRU[0];

    page.registrationNumberExistRadios[0].click();
    page.registrationNumber = organisation.registrationNumber;
    page.organisationName = organisation.organisationName;
    page.isPartOfArrangementRadio[1].click();
    page.isParentOfResponsibleUndertaking[0].click();
    page.isSubsidiaryOfResponsibleUndertaking[1].click();
    page.isPartOfFranchiseRadio[1].click();
    page.hasCeasedToBePartOfGroupRadio[1].click();

    page.checkboxes[0].click();
    fixture.detectChanges();

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'organisationStructure',
      currentStep: 'add',
      route,
      payload: {
        noc: {
          organisationStructure: {
            ...mockOrganisationStructure,
            organisationsAssociatedWithRU: [
              organisation,
              {
                registrationNumberExist: true,
                registrationNumber: organisation.registrationNumber,
                organisationName: organisation.organisationName,
                classificationCodesDetails: {
                  areSameAsRU: true,
                  codes: null,
                },
                isPartOfArrangement: false,
                isParentOfResponsibleUndertaking: true,
                isSubsidiaryOfResponsibleUndertaking: false,
                isPartOfFranchise: false,
                hasCeasedToBePartOfGroup: false,
              },
            ],
          },
        },
        nocSectionsCompleted: { organisationStructure: 'IN_PROGRESS' },
      },
    });
  });

  it('should submit with SIC codes and navigate to next route on add', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');
    const organisation = mockOrganisationStructure.organisationsAssociatedWithRU[0];

    page.registrationNumberExistRadios[0].click();
    page.registrationNumber = organisation.registrationNumber;
    page.organisationName = organisation.organisationName;
    page.type = 'SIC';
    page.code = '111';
    page.isPartOfArrangementRadio[1].click();
    page.isParentOfResponsibleUndertaking[0].click();
    page.isSubsidiaryOfResponsibleUndertaking[1].click();
    page.isPartOfFranchiseRadio[1].click();
    page.hasCeasedToBePartOfGroupRadio[1].click();

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'organisationStructure',
      currentStep: 'add',
      route,
      payload: {
        noc: {
          organisationStructure: {
            ...mockOrganisationStructure,
            organisationsAssociatedWithRU: [
              organisation,
              {
                registrationNumberExist: true,
                registrationNumber: organisation.registrationNumber,
                organisationName: organisation.organisationName,
                classificationCodesDetails: {
                  areSameAsRU: false,
                  codes: {
                    type: 'SIC',
                    codes: ['111'],
                    otherTypeName: null,
                  },
                },
                isPartOfArrangement: false,
                isParentOfResponsibleUndertaking: true,
                isSubsidiaryOfResponsibleUndertaking: false,
                isPartOfFranchise: false,
                hasCeasedToBePartOfGroup: false,
              },
            ],
          },
        },
        nocSectionsCompleted: { organisationStructure: 'IN_PROGRESS' },
      },
    });
  });

  it('should submit and navigate to next route on edit', () => {
    route.snapshot.params = { taskId: 1, index: 1 };
    store.setState(
      mockStateBuild(
        { organisationStructure: mockOrganisationStructure },
        { organisationStructure: 'IN_PROGRESS' as any },
      ),
    );
    createComponent();

    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');
    const organisation = mockOrganisationStructure.organisationsAssociatedWithRU[0];

    page.registrationNumberExistRadios[1].click();
    page.organisationName = 'New organisation name';
    page.checkboxes[0].click();

    page.submitButton.click();
    fixture.detectChanges();

    const { registrationNumber, ...editedOrg } = organisation;

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'organisationStructure',
      currentStep: 'edit',
      route,
      payload: {
        noc: {
          organisationStructure: {
            ...mockOrganisationStructure,
            organisationsAssociatedWithRU: [
              {
                ...editedOrg,
                registrationNumberExist: false,
                registrationNumber: null,
                organisationName: 'New organisation name',
                classificationCodesDetails: {
                  areSameAsRU: true,
                  codes: null,
                },
              },
            ],
          },
        },
        nocSectionsCompleted: { organisationStructure: 'IN_PROGRESS' },
      },
    });
  });
});
