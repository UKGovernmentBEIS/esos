import { CurrencyPipe } from '@angular/common';
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
import { energySavingsOpportunityMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { getFixedCostOptional } from '@shared/utils/bignumber.utils';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent } from 'govuk-components';

import { EnergySavingsCategoriesPotentialReduction } from 'esos-api';

import {
  ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
  EnergySavingsOpportunitiesCurrentStep,
} from '../energy-savings-opportunity.helper';
import { energySavingsOpportunityCategoryFormProvider } from './energy-savings-opportunity-category-form.provider';

@Component({
  selector: 'esos-energy-savings-opportunity-categories',
  standalone: true,
  imports: [
    WizardStepComponent,
    DetailsComponent,
    EnergySavingsCategoriesInputWithCostComponent,
    ReactiveFormsModule,
    CurrencyPipe,
    NoDataEnteredPipe,
    NoDataEnteredForCostPipe,
  ],
  templateUrl: './energy-savings-opportunity-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [energySavingsOpportunityCategoryFormProvider],
})
export default class EnergySavingsOpportunityCategoriesComponent {
  protected readonly energySavingsOpportunityMap = energySavingsOpportunityMap;
  private formData: Signal<EnergySavingsCategoriesPotentialReduction> = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  totalConsumption: Signal<number> = computed(() => getTotalReductionCategoriesOptional(this.formData()));

  totalCost: Signal<number> = computed(() => getTotalReductionCategoriesCostOptional(this.formData()));

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
      currentStep: EnergySavingsOpportunitiesCurrentStep.STEP3,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energySavingsOpportunities = {
          ...payload.noc.energySavingsOpportunities,
          energySavingsCategories: {
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
