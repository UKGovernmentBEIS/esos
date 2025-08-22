import { Routes } from '@angular/router';

import { resolveRegistrationNumber } from '@accounts/organisation-account-application/components/organisation-companies-house-container/user-verified-registration-number.resolver';
import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import { CreateOrganisationAccountStateProvider } from './+state';
import {
  OrganisationAccountApplicationCancelComponent,
  OrganisationAccountApplicationReceivedComponent,
  OrganisationAccountApplicationSummaryPageComponent,
} from './components';
import { OrganisationCompaniesHouseContainerComponent } from './components/organisation-companies-house-container/organisation-companies-house-container.component';
import { OrganisationDetailsContainerComponent } from './components/organisation-details-container/organisation-details-container.component';
import { OrganisationLocationContainerComponent } from './components/organisation-location-container/organisation-location-container.component';

export const ROUTES: Routes = [
  {
    path: '',
    providers: [
      {
        provide: ORGANISATION_ACCOUNT_STATE_PROVIDER,
        useClass: CreateOrganisationAccountStateProvider,
      },
    ],
    data: {
      breadcrumb: 'Apply for an organisation account',
    },
    children: [
      {
        path: '',
        title: 'Is the UK organisation registered at Companies House?',
        resolve: { resolveRegistrationNumber },
        component: OrganisationCompaniesHouseContainerComponent,
      },
      {
        path: 'details',
        title: 'Enter the organisation details',
        component: OrganisationDetailsContainerComponent,
        data: {
          backlink: '..',
        },
      },
      {
        path: 'location',
        title: ' Where is your registered office located?',
        component: OrganisationLocationContainerComponent,
        data: {
          backlink: '../details',
        },
      },
    ],
  },
  {
    path: 'cancel',
    title: 'Cancel Organisation account creation',
    data: { breadcrumb: true },
    component: OrganisationAccountApplicationCancelComponent,
  },
  {
    path: 'summary',
    title: 'Check the information provided before submitting',
    data: {
      breadcrumb: 'Organisation account summary',
    },
    component: OrganisationAccountApplicationSummaryPageComponent,
    canDeactivate: [PendingRequestGuard],
  },
  {
    path: 'submitted',
    title: 'Your organisation account has been created',
    component: OrganisationAccountApplicationReceivedComponent,
  },
];
