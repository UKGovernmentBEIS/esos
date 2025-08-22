import { CurrencyPipe, NgIf } from '@angular/common';
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
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { getFixedCostOptional } from '@shared/utils/bignumber.utils';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { SummaryListColumnValueDirective } from 'govuk-components';

import { EnergyConsumptionPotentialReduction } from 'esos-api';

import { energyConsumptionReductionFormProvider } from './energy-consumption-reduction-form.provider';

@Component({
  selector: 'esos-energy-consumption-reduction',
  standalone: true,
  imports: [
    WizardStepComponent,
    EnergyConsumptionInputWithCostComponent,
    ReactiveFormsModule,
    CurrencyPipe,
    NgIf,
    SummaryListColumnValueDirective,
    NoDataEnteredPipe,
    NoDataEnteredForCostPipe,
  ],
  templateUrl: './energy-consumption-reduction.component.html',
  providers: [energyConsumptionReductionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyConsumptionReductionComponent {
  protected readonly alternativeComplianceRoutesMap = alternativeComplianceRoutesMap;

  private formData: Signal<EnergyConsumptionPotentialReduction> = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  totalConsumption: Signal<number | null> = computed(() => getTotalConsumptionPotentialOptional(this.formData()));

  totalCost: Signal<number | null> = computed(() => getTotalConsumptionPotentialCostOptional(this.formData()));

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
      currentStep: CurrentStep.ENERGY_CONSUMPTION_REDUCTION,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.alternativeComplianceRoutes = {
          ...payload.noc.alternativeComplianceRoutes,
          energyConsumptionReduction: {
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
