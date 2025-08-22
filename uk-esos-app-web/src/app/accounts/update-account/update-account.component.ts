import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { map, switchMap } from 'rxjs';

import { ORGANISATION_ACCOUNT_FORM } from '@accounts/core/organisation-account-form.token';
import { OrganisationDetailsComponent } from '@accounts/shared/organisation-details/organisation-details.component';
import { organisationDetailsFormProvider } from '@shared/components/organisation-details-form/organisation-details-form.provider';

import { OrganisationAccountDTO, OrganisationAccountUpdateDTO, OrganisationAccountUpdateService } from 'esos-api';

import { AccountsStore } from '..';

@Component({
  selector: 'esos-update-account',
  standalone: true,
  imports: [OrganisationDetailsComponent],
  templateUrl: './update-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [organisationDetailsFormProvider],
})
export class UpdateAccountComponent {
  private accountId$ = this.route.paramMap.pipe(map((parameters) => +parameters.get('accountId')));

  constructor(
    @Inject(ORGANISATION_ACCOUNT_FORM) readonly form: UntypedFormGroup,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly organisationAccountUpdateService: OrganisationAccountUpdateService,
    private readonly store: AccountsStore,
  ) {}

  submit(): void {
    const {
      addressDetails: { line1, line2, city, county, postcode },
      registeredName: name,
      ...otherAccountProperties
    } = this.form.value;
    const account = {
      ...otherAccountProperties,
      name,
      line1,
      line2,
      city,
      county,
      postcode,
    } as OrganisationAccountUpdateDTO;

    if (account.type === 'SIC' && account.otherTypeName) {
      delete account.otherTypeName;
    }

    if (this.form.dirty) {
      this.accountId$
        .pipe(
          switchMap((accountId) => this.organisationAccountUpdateService.updateOrganisationAccount(accountId, account)),
        )
        .subscribe(() => {
          this.store.setSelectedAccount(account as OrganisationAccountDTO);
          this.router.navigate(['../'], { relativeTo: this.route });
        });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
