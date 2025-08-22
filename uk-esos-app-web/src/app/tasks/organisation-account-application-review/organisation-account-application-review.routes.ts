import { Routes } from '@angular/router';

import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';
import { OrganisationAccountApplicationReviewStateProvider } from '@tasks/organisation-account-application-review/+state/organisation-account-application-review.state.provider';
import { OrganisationAccountApplicationReviewSubmittedComponent } from '@tasks/organisation-account-application-review/components/organisation-account-application-reviewed/organisation-account-application-review-submitted.component';
import { OrganisationAmendDetailsContainerComponent } from '@tasks/organisation-account-application-review/components/organisation-amend-details-container/organisation-amend-details-container.component';
import { OrganisationAmendLocationContainerComponent } from '@tasks/organisation-account-application-review/components/organisation-amend-location-container/organisation-amend-location-container.component';

export const ROUTES: Routes = [
  {
    path: '',
    providers: [
      {
        provide: ORGANISATION_ACCOUNT_STATE_PROVIDER,
        useClass: OrganisationAccountApplicationReviewStateProvider,
      },
    ],
    children: [
      {
        path: 'details',
        component: OrganisationAmendDetailsContainerComponent,
      },
      {
        path: 'location',
        component: OrganisationAmendLocationContainerComponent,
      },
      {
        path: 'submitted',
        component: OrganisationAccountApplicationReviewSubmittedComponent,
      },
    ],
  },
];
