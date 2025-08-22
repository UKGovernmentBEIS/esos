import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { catchError, tap, throwError } from 'rxjs';

import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchBadRequest, ErrorCodes } from '@error/business-errors';
import { catchNotFoundRequest, ErrorCode } from '@error/not-found-error';
import { OrganisationAccountSummaryComponent } from '@shared/components/organisation-account-summary';
import {
  accountRegistrationNumberExistsError,
  organisationCompaniesHouseApiServiceUnavailableError,
  organisationCompaniesHouseApiUnauthorizedError,
  organisationCompaniesHouseNotExistsError,
} from '@shared/errors/organisation-account-application-business-error';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';

import { GovukComponentsModule } from 'govuk-components';

import { OrganisationAccountPayload } from 'esos-api';

import { OrganisationAccountService } from '../../../core/organisation-account.service';
import { organisationAccountQuery, OrganisationAccountStore } from '../../+state';

@Component({
  selector: 'esos-organisation-account-application-summary-page',
  templateUrl: './organisation-account-application-summary-page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeadingComponent, NgIf, GovukComponentsModule, OrganisationAccountSummaryComponent, RouterLink],
})
export class OrganisationAccountApplicationSummaryPageComponent {
  isSubmitDisabled: boolean;
  organisation: OrganisationAccountPayload;
  linkPrefix: string = '..';

  registrationStatus = this.store.select(organisationAccountQuery.selectRegistrationStatus);
  registrationNumber = this.store.select(organisationAccountQuery.selectRegistrationNumber);
  name = this.store.select(organisationAccountQuery.selectName);
  address = this.store.select(organisationAccountQuery.selectAddress);
  competentAuthority = this.store.select(organisationAccountQuery.selectCompetentAuthority);

  constructor(
    readonly store: OrganisationAccountStore,
    private readonly organisationAccountService: OrganisationAccountService,
    private readonly businessErrorService: BusinessErrorService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.organisation = organisationAccountService.payload;
  }

  onSubmit(): void {
    this.isSubmitDisabled = true;
    this.organisationAccountService
      .submitSummary()
      .pipe(
        tap(() => this.store.reset()),
        catchBadRequest(ErrorCodes.ACCOUNT1001, () =>
          this.businessErrorService.showError(accountRegistrationNumberExistsError),
        ),

        catchNotFoundRequest(ErrorCode.NOTFOUND1001, () =>
          this.businessErrorService.showError(organisationCompaniesHouseNotExistsError),
        ),

        catchError((err) => {
          switch (err.error.code) {
            case 'COMPANYINFO1001':
            case 'COMPANYINFO1003':
              return this.businessErrorService.showError(organisationCompaniesHouseApiServiceUnavailableError);
            case 'COMPANYINFO1002':
              return this.businessErrorService.showError(organisationCompaniesHouseApiUnauthorizedError);
            default:
              return throwError(() => err);
          }
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['../submitted'], { relativeTo: this.route });
        },
      });
  }
}
