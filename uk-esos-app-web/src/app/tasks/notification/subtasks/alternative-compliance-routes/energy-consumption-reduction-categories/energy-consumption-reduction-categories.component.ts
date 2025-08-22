import { CurrencyPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import {
  getTotalReductionCategoriesCostOptional,
  getTotalReductionCategoriesOptional,
} from '@shared/components/energy-savings-categories-input-with-cost/energy-savings-categories-input-with-cost';
import { EnergySavingsCategoriesInputWithCostComponent } from '@shared/components/energy-savings-categories-input-with-cost/energy-savings-categories-input-with-cost.component';
import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';
import { NoDataEnteredForCostPipe } from '@shared/pipes/no-data-entered-for-cost.pipe';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { getFixedCostOptional } from '@shared/utils/bignumber.utils';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { energyConsumptionReductionCategoriesFormProvider } from '@tasks/notification/subtasks/alternative-compliance-routes/energy-consumption-reduction-categories/energy-consumption-reduction-categories-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { EnergySavingsCategoriesPotentialReduction } from 'esos-api';

@Component({
  selector: 'esos-energy-consumption-reduction-categories',
  standalone: true,
  imports: [
    WizardStepComponent,
    EnergySavingsCategoriesInputWithCostComponent,
    ReactiveFormsModule,
    CurrencyPipe,
    NgIf,
    NoDataEnteredForCostPipe,
    NoDataEnteredPipe,
  ],
  templateUrl: './energy-consumption-reduction-categories.component.html',
  providers: [energyConsumptionReductionCategoriesFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyConsumptionReductionCategoriesComponent {
  protected readonly alternativeComplianceRoutesMap = alternativeComplianceRoutesMap;

  private formData: Signal<EnergySavingsCategoriesPotentialReduction> = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  totalConsumption: Signal<number | null> = computed(() => getTotalReductionCategoriesOptional(this.formData()));

  totalCost: Signal<number | null> = computed(() => getTotalReductionCategoriesCostOptional(this.formData()));

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
      currentStep: CurrentStep.ENERGY_CONSUMPTION_REDUCTION_CATEGORIES,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.alternativeComplianceRoutes = {
          ...payload.noc.alternativeComplianceRoutes,
          energyConsumptionReductionCategories: {
            energyManagementPractices: {
              energyConsumption: this.form.get('energyManagementPractices').value.energyConsumption ?? null,
              energyCost: getFixedCostOptional(this.form.get('energyManagementPractices').value.energyCost),
            },
            behaviourChangeInterventions: {
              energyConsumption: this.form.get('behaviourChangeInterventions').value.energyConsumption ?? null,
              energyCost: getFixedCostOptional(this.form.get('behaviourChangeInterventions').value.energyCost),
            },
            training: {
              energyConsumption: this.form.get('training').value.energyConsumption ?? null,
              energyCost: getFixedCostOptional(this.form.get('training').value.energyCost),
            },
            controlsImprovements: {
              energyConsumption: this.form.get('controlsImprovements').value.energyConsumption ?? null,
              energyCost: getFixedCostOptional(this.form.get('controlsImprovements').value.energyCost),
            },
            capitalInvestments: {
              energyConsumption: this.form.get('capitalInvestments').value.energyConsumption ?? null,
              energyCost: getFixedCostOptional(this.form.get('capitalInvestments').value.energyCost),
            },
            otherMeasures: {
              energyConsumption: this.form.get('otherMeasures').value.energyConsumption ?? null,
              energyCost: getFixedCostOptional(this.form.get('otherMeasures').value.energyCost),
            },
            energyConsumptionTotal: this.totalConsumption(),
            energyCostTotal: getFixedCostOptional(this.totalCost()),
          },
        };
      }),
    });
  }
}
