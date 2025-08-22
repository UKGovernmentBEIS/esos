import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { filter, startWith, take, takeUntil } from 'rxjs';

import { organisationAccountsCSVMapper } from '@accounts/upload-organisation-accounts/upload-organisation-accounts.map';
import {
  addOrganisationAccountDetailsGroup,
  UploadOrganisationAccountsFormModel,
  uploadOrganisationAccountsFormProvider,
  uploadOrganisationAccountsValidators,
} from '@accounts/upload-organisation-accounts/upload-organisation-accounts-form.provider';
import { csvFieldExistingEmailAsyncValidator } from '@accounts/upload-organisation-accounts/validators/csv-field-existing-email-async.validator';
import { csvFieldExistingRegistrationNumberAsyncValidator } from '@accounts/upload-organisation-accounts/validators/csv-field-existing-registration-number-async.validator';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { CsvWizardStepComponent } from '@shared/csv-wizard-step/csv-wizard-step.component';
import { TASK_FORM } from '@tasks/task-form.token';
import Papa from 'papaparse';

import { ButtonDirective, DetailsComponent, LinkDirective, NotificationBannerComponent } from 'govuk-components';

import { OrganisationAccountOnboardingRegistriesService, OrganisationAccountOnboardingRegistryDTO } from 'esos-api';

@Component({
  selector: 'esos-upload-organisation-accounts',
  standalone: true,
  imports: [
    CsvWizardStepComponent,
    LinkDirective,
    ButtonDirective,
    DetailsComponent,
    NgIf,
    NotificationBannerComponent,
  ],
  templateUrl: './upload-organisation-accounts.component.html',
  providers: [uploadOrganisationAccountsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadOrganisationAccountsComponent {
  @ViewChild(CsvWizardStepComponent) wizardStep: CsvWizardStepComponent;

  organisationAccountsDetailsCtrl = this.form.controls.organisationAccountsDetails;
  columnsCtrl = this.form.controls.columns;
  fileCtrl = this.form.controls.file;
  parsedData: WritableSignal<OrganisationAccountOnboardingRegistryDTO[] | null> = signal(null);
  showSuccess = signal(false);
  uploadedFile: File;

  constructor(
    @Inject(TASK_FORM) readonly form: FormGroup<UploadOrganisationAccountsFormModel>,
    private readonly registriesService: OrganisationAccountOnboardingRegistriesService,
    private readonly destroy$: DestroySubject,
    private readonly pendingRequest: PendingRequestService,
  ) {}

  onFileSelect(event: any) {
    this.showSuccess.update(() => false);
    this.wizardStep.isSummaryDisplayedSubject.next(false);
    this.uploadedFile = event.target.files[0];
    this.fileCtrl.setValue(this.uploadedFile);

    if (this.fileCtrl.invalid) {
      this.displayFileErrors();
    } else {
      Papa.parse(this.uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => this.processCSVData(result),
      });
    }

    event.target.value = '';
  }

  private processCSVData(result: Papa.ParseResult<unknown>) {
    const processedData = organisationAccountsCSVMapper(result.data);

    this.columnsCtrl.setValue(result.meta.fields);

    this.updateOrganisationAccountsDetailsCtrl(processedData);

    this.form.statusChanges
      .pipe(
        startWith(this.form.status),
        filter((status) => status !== 'PENDING'),
        take(1),
        takeUntil(this.destroy$),
      )
      .subscribe((status) => {
        if (status === 'VALID') {
          this.parsedData.update(() => processedData);
        } else {
          this.wizardStep.isSummaryDisplayedSubject.next(true);
          this.parsedData.update(() => null);
        }
      });
  }

  /**
   * Due to performance concerns as it would trigger upon each push,
   * separately add validators/asyncValidators and trigger validity manually for `organisationAccountsDetailsCtrl`,
   * only if the `columnCtrl` is valid
   */
  private updateOrganisationAccountsDetailsCtrl(processedData: OrganisationAccountOnboardingRegistryDTO[]) {
    this.organisationAccountsDetailsCtrl.clear();
    this.organisationAccountsDetailsCtrl.clearAsyncValidators();
    this.organisationAccountsDetailsCtrl.clearValidators();

    if (this.columnsCtrl.valid) {
      processedData?.map((organisationAccountDetails) =>
        this.organisationAccountsDetailsCtrl.push(addOrganisationAccountDetailsGroup(organisationAccountDetails)),
      );

      this.organisationAccountsDetailsCtrl.addValidators(uploadOrganisationAccountsValidators);

      this.organisationAccountsDetailsCtrl.addAsyncValidators([
        csvFieldExistingRegistrationNumberAsyncValidator(
          'There are duplicated registration numbers in the system',
          this.registriesService,
        ),
        csvFieldExistingEmailAsyncValidator('There are duplicated user emails in the system', this.registriesService),
      ]);

      this.organisationAccountsDetailsCtrl.updateValueAndValidity();
    }
  }

  /**
   * Since Upload File errors should appear alone, set temporarily other formControl errors to null
   */
  private displayFileErrors() {
    this.columnsCtrl.setErrors(null);
    this.organisationAccountsDetailsCtrl.setErrors(null);
    this.wizardStep.isSummaryDisplayedSubject.next(true);
    this.parsedData.update(() => null);
  }

  onSubmit() {
    this.registriesService
      .addOrganisationAccountOnboardingRegistries(
        this.organisationAccountsDetailsCtrl.value as OrganisationAccountOnboardingRegistryDTO[],
      )
      .pipe(this.pendingRequest.trackRequest())
      .subscribe(() => {
        this.showSuccess.update(() => true);
      });
  }
}
