import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { ActivityCodesGuidanceTemplateComponent } from '@shared/components/activity-codes-guidance-template/activity-codes-guidance-template.component';
import { ActivityCodesInputComponent } from '@shared/components/activity-codes-input/activity-codes-input.component';
import { organisationDetailsFormProvider } from '@shared/components/organisation-details-form';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';

@Component({
  selector: 'esos-organisation-details',
  templateUrl: './organisation-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule, WizardStepComponent, ActivityCodesInputComponent, ActivityCodesGuidanceTemplateComponent],
  providers: [organisationDetailsFormProvider],
  standalone: true,
})
export class OrganisationDetailsComponent {
  @Input() headerCaption: string;
  @Input() form: UntypedFormGroup;
  @Output() readonly submitForm = new EventEmitter<UntypedFormGroup>();

  submit(): void {
    this.submitForm.emit(this.form);
  }
}
