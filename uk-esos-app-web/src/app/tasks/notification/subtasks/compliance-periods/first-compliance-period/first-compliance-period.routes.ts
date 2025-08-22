import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import {
  canActivateCompliancePeriods,
  canActivateCompliancePeriodsSummary,
} from '@tasks/notification/subtasks/compliance-periods/compliance-periods.guard';
import { WizardStep } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

import { compliancePeriodBackLinkResolver } from '../compliance-periods.navigation';

export const FIRST_COMPLIANCE_PERIOD_ROUTES: Routes = [
  {
    path: '',
    providers: [
      NotificationApiService,
      NotificationStateService,
      {
        provide: COMPLIANCE_PERIOD_SUB_TASK,
        useValue: CompliancePeriodSubtask.FIRST,
      },
    ],
    children: [
      {
        path: '',
        canActivate: [canActivateCompliancePeriodsSummary],
        title: 'First Compliance Period',
        data: { breadcrumb: 'First Compliance Period' },
        loadComponent: () =>
          import('../shared/summary/summary.component').then((c) => c.CompliancePeriodSummaryComponent),
      },
      {
        path: WizardStep.INFORMATION_EXISTS,
        title: 'First Compliance Period Information Exists',
        canActivate: [canActivateCompliancePeriods],
        loadComponent: () =>
          import('../shared/information-exists/information-exists.component').then((c) => c.InformationExistsComponent),
      },
      {
        path: WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION,
        title: 'Organisational Energy Consumption',
        canActivate: [canActivateCompliancePeriods],
        resolve: {
          backlink: compliancePeriodBackLinkResolver(WizardStep.SUMMARY, WizardStep.INFORMATION_EXISTS),
        },
        loadComponent: () =>
          import('../shared/organisational-energy-consumption/organisational-energy-consumption.component').then(
            (c) => c.OrganisationalEnergyConsumptionComponent,
          ),
      },
      {
        path: WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION_BREAKDOWN,
        canActivate: [canActivateCompliancePeriods],
        title: 'Organisation Total Energy Consumption',
        resolve: {
          backlink: compliancePeriodBackLinkResolver(WizardStep.SUMMARY, WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION),
        },
        loadComponent: () =>
          import(
            '../shared/organisational-energy-consumption-breakdown/organisational-energy-consumption-breakdown.component'
          ).then((c) => c.OrganisationalEnergyConsumptionBreakdownComponent),
      },
      {
        path: WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION,
        title: 'Significant Energy Consumption',
        canActivate: [canActivateCompliancePeriods],
        resolve: {
          backlink: compliancePeriodBackLinkResolver(
            WizardStep.SUMMARY,
            WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION_BREAKDOWN,
          ),
        },
        loadComponent: () =>
          import('../shared/significant-energy-consumption/significant-energy-consumption.component').then(
            (c) => c.SignificantEnergyConsumptionComponent,
          ),
      },
      {
        path: WizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION,
        canActivate: [canActivateCompliancePeriods],
        title: 'Explanation Of Changes',
        resolve: {
          backlink: compliancePeriodBackLinkResolver(WizardStep.SUMMARY, WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION),
        },
        loadComponent: () =>
          import(
            '../shared/explanation-of-changes-to-total-energy-consumption/explanation-of-changes-to-total-energy-consumption.component'
          ).then((c) => c.ExplanationOfChangesToTotalEnergyConsumptionComponent),
      },
      {
        path: WizardStep.POTENTIAL_REDUCTION,
        canActivate: [canActivateCompliancePeriods],
        title: 'Annual Reduction Breakdown',
        resolve: {
          backlink: compliancePeriodBackLinkResolver(
            WizardStep.SUMMARY,
            WizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION,
          ),
        },
        loadComponent: () =>
          import('../shared/potential-reduction/potential-reduction.component').then(
            (c) => c.PotentialReductionComponent,
          ),
      },
    ],
  },
];
