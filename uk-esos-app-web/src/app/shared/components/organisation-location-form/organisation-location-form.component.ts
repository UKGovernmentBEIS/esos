import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { ORGANISATION_ACCOUNT_FORM } from '@accounts/core/organisation-account-form.token';
import { organisationWizardCancelLinkPath } from '@shared/constants/cancel-wizard-link-constants';
import { regulatorSchemeMap } from '@shared/interfaces/regulator-scheme';
import { originalOrder } from '@shared/keyvalue-order';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';

import { organisationLocationFormProvider } from './organisation-location-form.provider';

@Component({
  selector: 'esos-organisation-location-form',
  templateUrl: './organisation-location-form.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WizardStepComponent, SharedModule, NgForOf],
  providers: [organisationLocationFormProvider],
})
export class OrganisationLocationFormComponent {
  @Input() showCancelLink: boolean = true;
  readonly originalOrder = originalOrder;
  options = regulatorSchemeMap;
  formGroup: UntypedFormGroup;
  cancelLinkPath: string = organisationWizardCancelLinkPath;
  @Output() readonly submitForm = new EventEmitter<UntypedFormGroup>();

  constructor(@Inject(ORGANISATION_ACCOUNT_FORM) private readonly organisationForm: UntypedFormGroup) {
    this.formGroup = this.organisationForm;
  }

  onSubmit(): void {
    if (this.formGroup.valid || this.formGroup.dirty) {
      this.submitForm.emit(this.formGroup);
    }
  }
}
