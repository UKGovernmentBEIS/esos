import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { CsvWizardStepComponent } from '@shared/csv-wizard-step/csv-wizard-step.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
} from '@tasks/notification/subtasks/organisation-structure/organisation-structure.helper';
import {
  FlattenedOrganisationAssociatedWithRU,
  organisationStructureCsvMap,
  organisationStructureCSVMapper,
} from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';
import Papa from 'papaparse';

import { ButtonDirective, DetailsComponent, LinkDirective } from 'govuk-components';

import { ClassificationCodes, OrganisationAssociatedWithRU } from 'esos-api';

import {
  addOrganisationRUGroup,
  OrganisationsAssociatedWithRUFormModel,
  UploadCSVFormModel,
  uploadCsvFormProvider,
} from './upload-csv-form.provider';

@Component({
  selector: 'esos-upload-csv',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    CsvWizardStepComponent,
    ButtonDirective,
    NgIf,
    LinkDirective,
    DetailsComponent,
    NgForOf,
  ],
  templateUrl: './upload-csv.component.html',
  providers: [uploadCsvFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCsvComponent {
  @ViewChild(CsvWizardStepComponent) wizardStep: CsvWizardStepComponent;

  organisationsRUCtrl = this.form.controls.organisationsRU;
  columnsCtrl = this.form.controls.columns;
  fileCtrl = this.form.controls.file;
  parsedData: WritableSignal<FlattenedOrganisationAssociatedWithRU[] | null> = signal(null);
  uploadedFile: File;

  constructor(
    @Inject(TASK_FORM) readonly form: FormGroup<UploadCSVFormModel>,
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
  ) {}

  onFileSelect(event: any) {
    this.wizardStep.isSummaryDisplayedSubject.next(false);
    this.uploadedFile = event.target.files[0];
    this.fileCtrl.setValue(this.uploadedFile);

    if (this.fileCtrl.invalid) {
      this.displayFileErrors();
    } else {
      Papa.parse(this.uploadedFile, {
        header: true,
        transform: this.csvValuesTransformer,
        skipEmptyLines: true,
        complete: (result) => this.processCSVData(result),
      });
    }

    event.target.value = '';
  }

  private processCSVData(result: Papa.ParseResult<unknown>) {
    const processedData = organisationStructureCSVMapper(result.data);

    this.columnsCtrl.setValue(result.meta.fields);
    this.organisationsRUCtrl.clear();

    processedData?.map((organisationAssociatedWithRU) =>
      this.organisationsRUCtrl.push(addOrganisationRUGroup(organisationAssociatedWithRU)),
    );

    if (this.organisationsRUCtrl.valid) {
      this.parsedData.update(() => processedData);
    } else {
      this.wizardStep.isSummaryDisplayedSubject.next(true);
      this.parsedData.update(() => null);
    }
  }

  /**
   * Since Upload File errors should appear alone, set temporarily other formControl errors to null
   */
  private displayFileErrors() {
    this.columnsCtrl.setErrors(null);
    this.organisationsRUCtrl.setErrors(null);
    this.wizardStep.isSummaryDisplayedSubject.next(true);
    this.parsedData.update(() => null);
  }

  /**
   * Transforms a CSV value
   * If is of boolean type, then convert 'Yes', 'YES', 'NO' etc. to true or false
   * If is of classification type, then convert 'sic'/'other' to 'SIC'/ 'OTHER'
   * If is of code type, convert empty strings to undefined
   */
  private csvValuesTransformer(value: string, field: string) {
    switch (field) {
      case organisationStructureCsvMap.isPartOfArrangement:
      case organisationStructureCsvMap.hasCeasedToBePartOfGroup:
      case organisationStructureCsvMap.isPartOfFranchise:
      case organisationStructureCsvMap.isParentOfResponsibleUndertaking:
      case organisationStructureCsvMap.isSubsidiaryOfResponsibleUndertaking:
      case organisationStructureCsvMap.areSameAsRU:
        return value?.toLowerCase() === 'yes' ? true : value?.toLowerCase() === 'no' ? false : value;

      case organisationStructureCsvMap.type:
        return value?.toLowerCase() === 'sic' ? 'SIC' : value?.toLowerCase() === 'other' ? 'OTHER' : value;

      case organisationStructureCsvMap.registrationNumber:
      case organisationStructureCsvMap.code1:
      case organisationStructureCsvMap.code2:
      case organisationStructureCsvMap.code3:
      case organisationStructureCsvMap.code4:
        return value === '' ? null : value;

      default:
        return value;
    }
  }

  onSubmit() {
    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.UPLOAD_CSV,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.organisationStructure.organisationsAssociatedWithRU = this.getTransformedFormData();
      }),
    });
  }

  private getTransformedFormData(): OrganisationAssociatedWithRU[] {
    const organisationsAssociatedWithRU: OrganisationAssociatedWithRU[] = [];

    this.organisationsRUCtrl.controls.forEach((group) => {
      const newOrganisation: OrganisationAssociatedWithRU = {
        registrationNumberExist: !!group.controls.registrationNumber.value,
        organisationName: group.controls.organisationName.value,
        registrationNumber: group.controls.registrationNumber.value,
        isPartOfArrangement: group.controls.isPartOfArrangement.value,
        hasCeasedToBePartOfGroup: group.controls.hasCeasedToBePartOfGroup.value,
        isPartOfFranchise: group.controls.isPartOfFranchise.value,
        isParentOfResponsibleUndertaking: group.controls.isParentOfResponsibleUndertaking.value,
        isSubsidiaryOfResponsibleUndertaking: group.controls.isSubsidiaryOfResponsibleUndertaking.value,
        classificationCodesDetails: {
          areSameAsRU: group.controls.areSameAsRU.value,
          codes: this.getClassificationCodes(group),
        },
      };

      organisationsAssociatedWithRU.push(newOrganisation);
    });

    return organisationsAssociatedWithRU;
  }

  /**
   * Returns ClassificationCodes based on areSameAsRU.
   * If areSameAsRU === true or if at least no codes exist then sets to null
   * Otherwise returns the appropriate object
   */
  private getClassificationCodes(group: FormGroup<OrganisationsAssociatedWithRUFormModel>): ClassificationCodes | null {
    const codesValues = [
      group.controls.code1.value,
      group.controls.code2.value,
      group.controls.code3.value,
      group.controls.code4.value,
    ];

    const filteredCodes = group.controls.areSameAsRU.value
      ? []
      : codesValues.filter((code) => code !== '' && code !== null);

    return group.controls.areSameAsRU.value || !(filteredCodes.length > 0)
      ? null
      : {
          type: group.controls.type.value,
          otherTypeName: group.controls.type.value === 'OTHER' ? group.controls.otherTypeName.value : null,
          codes: filteredCodes,
        };
  }
}
