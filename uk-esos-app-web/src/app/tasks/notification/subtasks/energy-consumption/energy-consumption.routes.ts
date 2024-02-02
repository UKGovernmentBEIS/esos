import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';
import {
  canActivateEnergyConsumption,
  canActivateEnergyConsumptionSummary,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.guard';
import { WizardStep } from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';
import { backlinkResolver } from '@tasks/task-navigation';

export const ENERGY_CONSUMPTION_ROUTES: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        canActivate: [canActivateEnergyConsumptionSummary],
        title: 'Energy consumption',
        data: { breadcrumb: true },
        loadComponent: () => import('./summary/summary.component').then((c) => c.EnergyConsumptionSummaryComponent),
      },
      {
        path: WizardStep.TOTAL_ENERGY,
        canActivate: [canActivateEnergyConsumption],
        title: 'What is the total energy consumption in kWh for the reference period?',
        loadComponent: () => import('./total-energy/total-energy.component').then((c) => c.TotalEnergyComponent),
      },
      {
        path: WizardStep.USE_SIGNIFICANT_ENERGY,
        canActivate: [canActivateEnergyConsumption],
        title: 'Have you used significant energy consumption?',
        resolve: { backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.TOTAL_ENERGY) },
        loadComponent: () =>
          import('./use-significant-energy/use-significant-energy.component').then(
            (c) => c.UseSignificantEnergyComponent,
          ),
      },
      {
        path: WizardStep.SIGNIFICANT_ENERGY,
        canActivate: [canActivateEnergyConsumption],
        title: 'What is the significant energy consumption in kWh for the reference period?',
        resolve: { backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.USE_SIGNIFICANT_ENERGY) },
        loadComponent: () =>
          import('./significant-energy/significant-energy.component').then((c) => c.SignificantEnergyComponent),
      },
      {
        path: WizardStep.ENERGY_INTENSITY_RATIO,
        canActivate: [canActivateEnergyConsumption],
        title: 'What is the energy intensity ratio for each organisational purpose?',
        resolve: {
          backlink: () => {
            const router = inject(Router);
            const store = inject(RequestTaskStore);

            const energyConsumption = store.select(notificationQuery.selectEnergyConsumption)();
            const isChangeClicked = !!router.getCurrentNavigation().finalUrl.queryParams?.change;

            return isChangeClicked
              ? WizardStep.SUMMARY
              : energyConsumption.significantEnergyConsumptionExists
              ? '../' + WizardStep.SIGNIFICANT_ENERGY
              : '../' + WizardStep.USE_SIGNIFICANT_ENERGY;
          },
        },
        loadComponent: () =>
          import('./energy-intensity-ratio/energy-intensity-ratio.component').then(
            (c) => c.EnergyIntensityRatioComponent,
          ),
      },
      {
        path: WizardStep.ADDITIONAL_INFO,
        canActivate: [canActivateEnergyConsumption],
        title: 'Do you want to add more information to give context to the energy intensity ratio?',
        resolve: { backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.ENERGY_INTENSITY_RATIO) },
        loadComponent: () =>
          import('./additional-info/additional-info.component').then((c) => c.AdditionalInfoComponent),
      },
    ],
  },
];
