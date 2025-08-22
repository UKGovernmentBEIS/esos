import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';
import { backlinkResolver } from '@tasks/task-navigation';

import {
  canActivateComplianceRoute,
  canActivateComplianceRouteSummary,
  canActivateRouteAOrRouteCOrRouteE,
  canEditEnergyAudit,
} from './compliance-route.guard';
import { WizardStep } from './compliance-route.helper';
import { resolveComplianceRouteBackLink } from './compliance-route.resolver';

export const COMPLIANCE_ROUTE_ROUTES: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        canActivate: [canActivateComplianceRouteSummary],
        title: 'Compliance route',
        data: { breadcrumb: 'Compliance route' },
        loadComponent: () =>
          import('./compliance-route-summary/compliance-route-summary.component').then(
            (c) => c.ComplianceRouteSummaryComponent,
          ),
      },
      {
        path: WizardStep.DATA_ESTIMATED,
        canActivate: [canActivateComplianceRoute],
        title: 'Did you use any estimates in relation to the following calculations (as applicable)?',
        loadComponent: () => import('./data-estimated/data-estimated.component').then((c) => c.DataEstimatedComponent),
      },
      {
        path: WizardStep.TWELVE_MONTHS_VERIFIABLE_DATA,
        canActivate: [canActivateRouteAOrRouteCOrRouteE],
        title: 'Did all your energy audits use 12 months of verifiable data?',
        resolve: {
          backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.DATA_ESTIMATED),
        },
        loadComponent: () =>
          import('./twelve-months-verifiable-data/twelve-months-verifiable-data.component').then(
            (c) => c.TwelveMonthsVerifiableDataComponent,
          ),
      },
      {
        path: WizardStep.ESTIMATION_METHODS_RECORDED,
        canActivate: [canActivateComplianceRoute],
        title: 'Are the methods used for estimated data recorded in the evidence pack?',
        resolve: {
          backlink: resolveComplianceRouteBackLink(WizardStep.ESTIMATION_METHODS_RECORDED),
        },
        loadComponent: () =>
          import('./estimation-methods-recorded/estimation-methods-recorded.component').then(
            (c) => c.EstimationMethodsRecordedComponent,
          ),
      },
      {
        path: WizardStep.ENERGY_CONSUMPTION_PROFILING,
        canActivate: [canActivateRouteAOrRouteCOrRouteE],
        title:
          'Did this organisation use energy consumption profiling for the purpose of analysing its energy consumption for all ESOS energy audits?',
        resolve: { backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.ESTIMATION_METHODS_RECORDED) },
        loadComponent: () =>
          import('./energy-consumption-profiling/energy-consumption-profiling.component').then(
            (c) => c.EnergyConsumptionProfilingComponent,
          ),
      },
      {
        path: WizardStep.ENERGY_CONSUMPTION_PROFILING_METHODS_RECORDED,
        canActivate: [canActivateRouteAOrRouteCOrRouteE],
        title: 'Are the methods used for energy consumption profiling recorded in the evidence pack?',
        resolve: {
          backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.ENERGY_CONSUMPTION_PROFILING),
        },
        loadComponent: () =>
          import(
            './energy-consumption-profiling-methods-recorded/energy-consumption-profiling-methods-recorded.component'
          ).then((c) => c.EnergyConsumptionProfilingMethodsRecordedComponent),
      },
      {
        path: WizardStep.ENERGY_CONSUMPTION_PROFILING_NOT_USED_RECORDED,
        canActivate: [canActivateRouteAOrRouteCOrRouteE],
        title:
          'Does the evidence pack record the extent to which, and the reasons why, energy consumption profiling was not used in the energy audit and the details of the alternative method of analysis used?',
        resolve: {
          backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.ENERGY_CONSUMPTION_PROFILING),
        },
        loadComponent: () =>
          import(
            './energy-consumption-profiling-not-used-recorded/energy-consumption-profiling-not-used-recorded.component'
          ).then((c) => c.EnergyConsumptionProfilingNotUsedRecordedComponent),
      },
      {
        path: WizardStep.ENERGY_AUDITS,
        title: 'Add an energy audit',
        resolve: { backlink: resolveComplianceRouteBackLink(WizardStep.ENERGY_AUDITS) },
        loadComponent: () => import('./energy-audits/energy-audits.component').then((c) => c.EnergyAuditsComponent),
      },
      {
        path: WizardStep.ADD_ENERGY_AUDIT,
        title: 'Enter the energy audit details',
        data: { backlink: `../${WizardStep.ENERGY_AUDITS}` },
        loadComponent: () =>
          import('./add-energy-audit/add-energy-audit.component').then((c) => c.AddEnergyAuditComponent),
      },
      {
        path: `:index/${WizardStep.EDIT_ENERGY_AUDIT}`,
        canActivate: [canEditEnergyAudit],
        title: 'Enter the energy audit details',
        data: { backlink: `../../${WizardStep.ENERGY_AUDITS}` },
        loadComponent: () =>
          import('./add-energy-audit/add-energy-audit.component').then((c) => c.AddEnergyAuditComponent),
      },
      {
        path: WizardStep.PROHIBITED_DISCLOSING,
        canActivate: [canActivateComplianceRoute],
        title:
          'Are there any parts of the ESOS report, or supporting information, that the responsible undertaking is prohibited from disclosing to any group undertaking?',
        resolve: { backlink: resolveComplianceRouteBackLink(WizardStep.PROHIBITED_DISCLOSING) },
        loadComponent: () =>
          import('./prohibited-disclosing/prohibited-disclosing.component').then(
            (c) => c.ProhibitedDisclosingComponent,
          ),
      },
      {
        path: WizardStep.PROHIBITED_DISCLOSING_PARTS,
        canActivate: [canActivateComplianceRoute],
        title:
          'Which parts of the ESOS report or supporting information is the responsible undertaking prohibited by law from disclosing?',
        resolve: {
          backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.PROHIBITED_DISCLOSING),
        },
        loadComponent: () =>
          import('./prohibited-disclosing-parts/prohibited-disclosing-parts.component').then(
            (c) => c.ProhibitedDisclosingPartsComponent,
          ),
      },
      {
        path: WizardStep.PROHIBITED_DISCLOSING_REASON,
        canActivate: [canActivateComplianceRoute],
        title: 'Why is disclosure of these parts of the ESOS report or supporting information prohibited by law?',
        resolve: {
          backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.PROHIBITED_DISCLOSING_PARTS),
        },
        loadComponent: () =>
          import('./prohibited-disclosing-reason/prohibited-disclosing-reason.component').then(
            (c) => c.ProhibitedDisclosingReasonComponent,
          ),
      },
    ],
  },
];
