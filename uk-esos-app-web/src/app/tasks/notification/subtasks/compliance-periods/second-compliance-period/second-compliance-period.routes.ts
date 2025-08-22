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

export const SECOND_COMPLIANCE_PERIOD_ROUTES: Routes = [
  {
    path: '',
    providers: [
      NotificationApiService,
      NotificationStateService,
      {
        provide: COMPLIANCE_PERIOD_SUB_TASK,
        useValue: CompliancePeriodSubtask.SECOND,
      },
    ],
    children: [
      {
        path: '',
        canActivate: [canActivateCompliancePeriodsSummary],
        title: 'Second Compliance Period',
        data: { breadcrumb: 'Second Compliance Period' },
        loadComponent: () =>
          import('../shared/summary/summary.component').then((c) => c.CompliancePeriodSummaryComponent),
      },
      {
        path: WizardStep.INFORMATION_EXISTS,
        canActivate: [canActivateCompliancePeriods],
        title: 'Second Compliance Period Information Exists',
        loadComponent: () =>
          import('../shared/information-exists/information-exists.component').then((c) => c.InformationExistsComponent),
      },
      {
        path: WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION,
        title: 'Total Energy Consumption Breakdown',
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
        canActivate: [canActivateCompliancePeriods],
        title: 'Significant Energy Consumption',
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
        title: 'Potential Reduction',
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
      {
        path: WizardStep.REDUCTION_ACHIEVED,
        canActivate: [canActivateCompliancePeriods],
        title: 'Reduction Achieved',
        resolve: {
          backlink: compliancePeriodBackLinkResolver(WizardStep.SUMMARY, WizardStep.POTENTIAL_REDUCTION),
        },
        loadComponent: () =>
          import('../second-compliance-period/reduction-achieved/reduction-achieved.component').then(
            (c) => c.ReductionAchievedComponent,
          ),
      },
    ],
  },
];
