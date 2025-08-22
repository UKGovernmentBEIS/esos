import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';

import { ORGANISATION_ACCOUNT_FORM } from '@accounts/core/organisation-account-form.token';
import { organisationCompaniesHouseFormProvider } from '@accounts/organisation-account-application/components/organisation-companies-house-container/organisation-companies-house-form.provider';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { OrganisationCompaniesHouseFormComponent } from '@shared/components/organisation-companies-house-form';
import { HouseCompanyDetailsService } from '@shared/services/house-company-details-service/house-company-details.service';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';

import { OrganisationAccountStore } from '../../+state';

@Component({
  selector: 'esos-organisation-companies-house-container',
  templateUrl: './organisation-companies-house-container.component.html',
  imports: [ReactiveFormsModule, WizardStepComponent, OrganisationCompaniesHouseFormComponent],
  standalone: true,
  providers: [organisationCompaniesHouseFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationCompaniesHouseContainerComponent {
  constructor(
    @Inject(ORGANISATION_ACCOUNT_FORM) readonly form: UntypedFormGroup,
    readonly pendingRequest: PendingRequestService,
    private readonly houseCompanyDetailsService: HouseCompanyDetailsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly organisationAccountStore: OrganisationAccountStore,
  ) {}

  submit(): void {
    const registrationStatus = this.form.get('registrationNumberExist').value;
    this.organisationAccountStore.setRegistrationStatus(registrationStatus);

    if (registrationStatus) {
      const registrationNumber = this.form.get('registrationNumber').value;

      this.houseCompanyDetailsService
        .getCompanyProfile(registrationNumber)
        .pipe(
          map((companyProfile) => {
            this.organisationAccountStore.setRegistrationNumber(registrationNumber);
            this.organisationAccountStore.setRegisteredName(companyProfile?.name);
            this.organisationAccountStore.setAddress({
              ...this.organisationAccountStore.stateAsSignal()?.address,
              ...companyProfile?.address,
            });
            this.organisationAccountStore.setType(companyProfile?.sicCodes?.length ? 'SIC' : null);
            this.organisationAccountStore.setCodes(companyProfile?.sicCodes?.length ? companyProfile?.sicCodes : []);
          }),
          this.pendingRequest.trackRequest(),
        )
        .subscribe(() => this.router.navigate(['details'], { relativeTo: this.route }));
    } else {
      this.organisationAccountStore.setRegistrationNumber(null);
      this.router.navigate(['details'], { relativeTo: this.route });
    }
  }
}
