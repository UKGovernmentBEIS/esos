import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ORGANISATION_ACCOUNT_FORM } from '@accounts/core/organisation-account-form.token';
import { ActivityCodesInputComponent } from '@shared/components/activity-codes-input/activity-codes-input.component';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { OrganisationAccountApplicationReviewStateService } from '@tasks/organisation-account-application-review/+state/organisation-account-application-review-state.service';
import { OrganisationApplicationReviewAmendService } from '@tasks/organisation-account-application-review/services/organisation-application-review-amend.service';

import { organisationDetailsFormProvider } from 'src/app/shared/components/organisation-details-form';

@Component({
  selector: 'esos-organisation-amend-address-container',
  templateUrl: './organisation-amend-details-container.component.html',
  imports: [SharedModule, WizardStepComponent, ActivityCodesInputComponent],
  providers: [organisationDetailsFormProvider],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationAmendDetailsContainerComponent {
  codeFormArray = this.form.get('codes') as FormArray;

  constructor(
    @Inject(ORGANISATION_ACCOUNT_FORM) readonly form: UntypedFormGroup,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stateService: OrganisationAccountApplicationReviewStateService,
    private readonly amendService: OrganisationApplicationReviewAmendService,
  ) {}

  submit(): void {
    if (this.form.dirty) {
      const registeredName = this.form.get('registeredName').value;
      const type = this.form.get('type').value;
      const otherTypeName = this.form.get('otherTypeName').value;
      const codes = this.codeFormArray.value;
      const addressDetails = this.form.get('addressDetails').value;

      this.stateService.setRegisteredName(registeredName);
      this.stateService.setType(type);
      type === 'OTHER' ? this.stateService.setOtherTypeName(otherTypeName) : this.stateService.setOtherTypeName(null);
      this.stateService.setCodes(codes);
      this.stateService.setAddress(addressDetails);

      this.amendService.submitAmendRequest().subscribe({
        next: () => {
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
      });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
}
