import { Routes } from '@angular/router';

import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import {
  canActivateAlternativeComplianceRoutes,
  canActivateAlternativeComplianceRoutesSummary,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.guard';
import { WizardStep } from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { alternativeComplianceRoutesBacklinkResolver } from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes-backlink.resolver';

export const ALTERNATIVE_COMPLIANCE_ROUTES_ROUTES: Routes = [
  {
    path: '',
    title: alternativeComplianceRoutesMap.title,
    data: {
      breadcrumb: alternativeComplianceRoutesMap.title,
    },
    canActivate: [canActivateAlternativeComplianceRoutesSummary],
    loadComponent: () =>
      import('@tasks/notification/subtasks/alternative-compliance-routes/summary').then((c) => c.SummaryComponent),
  },
  {
    path: WizardStep.TOTAL_ENERGY_CONSUMPTION_REDUCTION,
    title: alternativeComplianceRoutesMap.totalEnergyConsumptionReduction.title,
    canActivate: [canActivateAlternativeComplianceRoutes],
    loadComponent: () =>
      import('@tasks/notification/subtasks/alternative-compliance-routes/total-energy-consumption-reduction').then(
        (c) => c.TotalEnergyConsumptionReductionComponent,
      ),
  },
  {
    path: WizardStep.ENERGY_CONSUMPTION_REDUCTION,
    title: alternativeComplianceRoutesMap.energyConsumptionReduction.title,
    resolve: {
      backlink: alternativeComplianceRoutesBacklinkResolver(WizardStep.ENERGY_CONSUMPTION_REDUCTION),
    },
    canActivate: [canActivateAlternativeComplianceRoutes],
    loadComponent: () =>
      import('@tasks/notification/subtasks/alternative-compliance-routes/energy-consumption-reduction').then(
        (c) => c.EnergyConsumptionReductionComponent,
      ),
  },
  {
    path: WizardStep.ENERGY_CONSUMPTION_REDUCTION_CATEGORIES,
    title: alternativeComplianceRoutesMap.energyConsumptionReductionCategories.title,
    resolve: {
      backlink: alternativeComplianceRoutesBacklinkResolver(WizardStep.ENERGY_CONSUMPTION_REDUCTION_CATEGORIES),
    },
    canActivate: [canActivateAlternativeComplianceRoutes],
    loadComponent: () =>
      import('@tasks/notification/subtasks/alternative-compliance-routes/energy-consumption-reduction-categories').then(
        (c) => c.EnergyConsumptionReductionCategoriesComponent,
      ),
  },
  {
    path: WizardStep.ASSETS,
    title: alternativeComplianceRoutesMap.assets.title,
    resolve: {
      backlink: alternativeComplianceRoutesBacklinkResolver(WizardStep.ASSETS),
    },
    canActivate: [canActivateAlternativeComplianceRoutes],
    loadComponent: () =>
      import('@tasks/notification/subtasks/alternative-compliance-routes/assets').then((c) => c.AssetsComponent),
  },
  {
    path: WizardStep.ISO_50001_CERTIFICATE_DETAILS,
    title: alternativeComplianceRoutesMap.iso50001CertificateDetails.title,
    resolve: {
      backlink: alternativeComplianceRoutesBacklinkResolver(WizardStep.ISO_50001_CERTIFICATE_DETAILS),
    },
    canActivate: [canActivateAlternativeComplianceRoutes],
    loadComponent: () =>
      import('@tasks/notification/subtasks/alternative-compliance-routes/iso-50001-certificate-details').then(
        (c) => c.Iso50001CertificateDetailsComponent,
      ),
  },
  {
    path: WizardStep.DEC_CERTIFICATES_DETAILS,
    title: alternativeComplianceRoutesMap.decCertificatesDetails.title,
    resolve: {
      backlink: alternativeComplianceRoutesBacklinkResolver(WizardStep.DEC_CERTIFICATES_DETAILS),
    },
    canActivate: [canActivateAlternativeComplianceRoutes],
    loadComponent: () =>
      import('@tasks/notification/subtasks/alternative-compliance-routes/dec-certificates-details').then(
        (c) => c.DecCertificatesDetailsComponent,
      ),
  },
  {
    path: WizardStep.GDA_CERTIFICATES_DETAILS,
    title: alternativeComplianceRoutesMap.gdaCertificatesDetails.title,
    resolve: {
      backlink: alternativeComplianceRoutesBacklinkResolver(WizardStep.GDA_CERTIFICATES_DETAILS),
    },
    canActivate: [canActivateAlternativeComplianceRoutes],
    loadComponent: () =>
      import('@tasks/notification/subtasks/alternative-compliance-routes/gda-certificates-details').then(
        (c) => c.GdaCertificatesDetailsComponent,
      ),
  },
];
