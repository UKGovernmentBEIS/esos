import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ORGANISATION_ACCOUNT_FORM } from '@accounts/core/organisation-account-form.token';
import { OrganisationAccountStore } from '@accounts/organisation-account-application/+state';
import { OrganisationDetailsComponent } from '@accounts/shared/organisation-details/organisation-details.component';
import { organisationDetailsFormProvider } from '@shared/components/organisation-details-form';

@Component({
  selector: 'esos-organisation-details-container',
  standalone: true,
  imports: [OrganisationDetailsComponent],
  templateUrl: './organisation-details-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [organisationDetailsFormProvider],
})
export class OrganisationDetailsContainerComponent {
  codeFormArray = this.form.get('codes') as FormArray;

  constructor(
    @Inject(ORGANISATION_ACCOUNT_FORM) readonly form: UntypedFormGroup,
    private readonly organisationAccountStore: OrganisationAccountStore,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  submit(): void {
    if (this.form.dirty) {
      const registeredName = this.form.get('registeredName').value;
      const type = this.form.get('type').value;
      const otherTypeName = this.form.get('otherTypeName').value;
      const codes = this.codeFormArray.value;
      const addressDetails = this.form.get('addressDetails').value;

      this.organisationAccountStore.setRegisteredName(registeredName);
      this.organisationAccountStore.setType(type);
      type === 'OTHER'
        ? this.organisationAccountStore.setOtherTypeName(otherTypeName)
        : this.organisationAccountStore.setOtherTypeName(null);
      this.organisationAccountStore.setCodes(codes);
      this.organisationAccountStore.setAddress(addressDetails);

      this.router.navigate(['../location'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../location'], { relativeTo: this.route });
    }
  }
}
