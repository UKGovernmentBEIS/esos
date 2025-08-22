import { Routes } from '@angular/router';

import { energySavingsOpportunityMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';
import { backlinkResolver } from '@tasks/task-navigation';

import {
  canActivateEnergySavingsOpportunity,
  canActivateEnergySavingsOpportunitySummary,
} from './energy-savings-opportunity.guard';
import { EnergySavingsOpportunitiesWizardStep } from './energy-savings-opportunity.helper';

export const ENERGY_SAVINGS_OPPORTUNITY: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        title: energySavingsOpportunityMap.title,
        canActivate: [canActivateEnergySavingsOpportunitySummary],
        data: { breadcrumb: energySavingsOpportunityMap.title },
        loadComponent: () =>
          import('./energy-savings-opportunity-summary/energy-savings-opportunity-summary.component'),
      },
      {
        path: EnergySavingsOpportunitiesWizardStep.STEP1,
        title: energySavingsOpportunityMap.implementationEnergyConsumption.title,
        canActivate: [canActivateEnergySavingsOpportunity],
        loadComponent: () =>
          import(
            './energy-savings-opportunity-implementation-reduction/energy-savings-opportunity-implementation-reduction.component'
          ),
      },
      {
        path: EnergySavingsOpportunitiesWizardStep.STEP2,
        title: energySavingsOpportunityMap.energyConsumption.title,
        canActivate: [canActivateEnergySavingsOpportunity],
        resolve: {
          backlink: backlinkResolver(
            EnergySavingsOpportunitiesWizardStep.SUMMARY,
            EnergySavingsOpportunitiesWizardStep.STEP1,
          ),
        },
        loadComponent: () => import('./energy-savings-opportunity/energy-savings-opportunity.component'),
      },
      {
        path: EnergySavingsOpportunitiesWizardStep.STEP3,
        title: energySavingsOpportunityMap.energySavingsCategories.title,
        canActivate: [canActivateEnergySavingsOpportunity],
        resolve: {
          backlink: backlinkResolver(
            EnergySavingsOpportunitiesWizardStep.SUMMARY,
            EnergySavingsOpportunitiesWizardStep.STEP2,
          ),
        },
        loadComponent: () =>
          import('./energy-savings-opportunity-categories/energy-savings-opportunity-categories.component'),
      },
    ],
  },
];
