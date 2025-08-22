import { Routes } from '@angular/router';

import { SideEffectsHandler } from '@common/forms/side-effects/side-effects-handler';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';

export const NOTIFICATION_ROUTES: Routes = [
  {
    path: '',
    providers: [
      SideEffectsHandler,
      provideNotificationTaskServices(),
      provideNotificationSideEffects(),
      provideNotificationStepFlowManagers(),
    ],
    children: [
      {
        path: 'reporting-obligation',
        loadChildren: () => import('./subtasks/reporting-obligation').then((r) => r.REPORTING_OBLIGATION_ROUTES),
      },
      {
        path: 'responsible-undertaking',
        loadChildren: () => import('./subtasks/responsible-undertaking').then((r) => r.RESPONSIBLE_UNDERTAKING_ROUTES),
      },
      {
        path: 'contact-persons',
        loadChildren: () => import('./subtasks/contact-persons').then((r) => r.CONTACT_PERSONS_ROUTES),
      },
      {
        path: 'lead-assessor-details',
        loadChildren: () => import('./subtasks/lead-assessor-details').then((r) => r.LEAD_ASSESSOR_DETAILS_ROUTES),
      },
      {
        path: 'compliance-route',
        loadChildren: () => import('./subtasks/compliance-route').then((r) => r.COMPLIANCE_ROUTE_ROUTES),
      },
      {
        path: 'assessment-personnel',
        loadChildren: () => import('./subtasks/assessment-personnel').then((r) => r.ASSESSMENT_PERSONNEL_ROUTES),
      },
      {
        path: 'first-compliance-period',
        loadChildren: () =>
          import('./subtasks/compliance-periods/first-compliance-period').then((r) => r.FIRST_COMPLIANCE_PERIOD_ROUTES),
      },
      {
        path: 'second-compliance-period',
        loadChildren: () =>
          import('./subtasks/compliance-periods/second-compliance-period').then(
            (r) => r.SECOND_COMPLIANCE_PERIOD_ROUTES,
          ),
      },
      {
        path: 'energy-savings-achieved',
        loadChildren: () => import('./subtasks/energy-savings-achieved').then((r) => r.ENERGY_SAVINGS_ACHIEVED_ROUTES),
      },
      {
        path: 'energy-savings-opportunities',
        loadChildren: () => import('./subtasks/energy-savings-opportunity').then((r) => r.ENERGY_SAVINGS_OPPORTUNITY),
      },
      {
        path: 'organisation-structure',
        loadChildren: () => import('./subtasks/organisation-structure').then((r) => r.ORGANISATION_STRUCTURE_ROUTES),
      },
      {
        path: 'energy-consumption',
        loadChildren: () => import('./subtasks/energy-consumption').then((r) => r.ENERGY_CONSUMPTION_ROUTES),
      },
      {
        path: 'alternative-compliance-routes',
        loadChildren: () =>
          import('./subtasks/alternative-compliance-routes').then((r) => r.ALTERNATIVE_COMPLIANCE_ROUTES_ROUTES),
      },
      {
        path: 'return-to-submit',
        loadChildren: () => import('./return-to-submit').then((r) => r.RETURN_FOR_SUBMIT_ROUTES),
      },
      {
        path: 'confirmation',
        loadChildren: () => import('./subtasks/confirmation').then((r) => r.CONFIRMATION_ROUTES),
      },
      {
        path: 'submit',
        loadChildren: () => import('./submit').then((r) => r.NOTIFICATION_SUBMIT_ROUTES),
      },
      {
        path: 'send-for-review',
        title: 'Send notification for review',
        loadChildren: () => import('./send-to-restricted').then((r) => r.SEND_TO_RESTRICTED_ROUTES),
      },
    ],
  },
];
