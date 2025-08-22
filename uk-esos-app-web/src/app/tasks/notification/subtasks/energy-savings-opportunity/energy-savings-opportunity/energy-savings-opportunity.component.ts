import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import {
  getTotalConsumptionPotentialCostOptional,
  getTotalConsumptionPotentialOptional,
} from '@shared/components/energy-consumption-input-with-cost/energy-consumption-input-with-cost';
import { EnergyConsumptionInputWithCostComponent } from '@shared/components/energy-consumption-input-with-cost/energy-consumption-input-with-cost.component';
import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';
import { NoDataEnteredForCostPipe } from '@shared/pipes/no-data-entered-for-cost.pipe';
import { energySavingsOpportunityMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { getFixedCostOptional } from '@shared/utils/bignumber.utils';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent } from 'govuk-components';

import { EnergyConsumptionPotentialReduction } from 'esos-api';

import {
  ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
  EnergySavingsOpportunitiesCurrentStep,
} from '../energy-savings-opportunity.helper';
import { energySavingsOpportunityFormProvider } from './energy-savings-opportunity-form.provider';

@Component({
  selector: 'esos-energy-savings-opportunity',
  standalone: true,
  imports: [
    WizardStepComponent,
    DetailsComponent,
    EnergyConsumptionInputWithCostComponent,
    ReactiveFormsModule,
    CurrencyPipe,
    NoDataEnteredPipe,
    NoDataEnteredForCostPipe,
  ],
  templateUrl: './energy-savings-opportunity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [energySavingsOpportunityFormProvider],
})
export default class EnergySavingsOpportunityComponent {
  protected readonly energySavingsOpportunityMap = energySavingsOpportunityMap;
  private formData: Signal<EnergyConsumptionPotentialReduction> = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  totalConsumption: Signal<number> = computed(() => getTotalConsumptionPotentialOptional(this.formData()));

  totalCost: Signal<number> = computed(() => getTotalConsumptionPotentialCostOptional(this.formData()));

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
      currentStep: EnergySavingsOpportunitiesCurrentStep.STEP2,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energySavingsOpportunities = {
          ...payload.noc.energySavingsOpportunities,
          energyConsumption: {
            buildings: {
              energyConsumption: this.form.get('buildings').value.energyConsumption ?? null,
              energyCost: getFixedCostOptional(this.form.get('buildings').value.energyCost),
            },
            transport: {
              energyConsumption: this.form.get('transport').value.energyConsumption ?? null,
              energyCost: getFixedCostOptional(this.form.get('transport').value.energyCost),
            },
            industrialProcesses: {
              energyConsumption: this.form.get('industrialProcesses').value.energyConsumption ?? null,
              energyCost: getFixedCostOptional(this.form.get('industrialProcesses').value.energyCost),
            },
            otherProcesses: {
              energyConsumption: this.form.get('otherProcesses').value.energyConsumption ?? null,
              energyCost: getFixedCostOptional(this.form.get('otherProcesses').value.energyCost),
            },
            energyConsumptionTotal: this.totalConsumption(),
            energyCostTotal: getFixedCostOptional(this.totalCost()),
          },
        };
      }),
    });
  }
}
