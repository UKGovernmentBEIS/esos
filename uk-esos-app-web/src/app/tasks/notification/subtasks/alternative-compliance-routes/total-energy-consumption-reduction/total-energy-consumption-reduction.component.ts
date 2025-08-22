import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { getFixedCostOptional } from '@shared/utils/bignumber.utils';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { totalEnergyConsumptionReductionFormProvider } from '@tasks/notification/subtasks/alternative-compliance-routes/total-energy-consumption-reduction/total-energy-consumption-reduction-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { TextInputComponent } from 'govuk-components';

@Component({
  selector: 'esos-total-energy-consumption-reduction',
  standalone: true,
  imports: [TextInputComponent, WizardStepComponent, ReactiveFormsModule],
  templateUrl: './total-energy-consumption-reduction.component.html',
  providers: [totalEnergyConsumptionReductionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalEnergyConsumptionReductionComponent {
  protected readonly alternativeComplianceRoutesMap = alternativeComplianceRoutesMap;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
      currentStep: CurrentStep.TOTAL_ENERGY_CONSUMPTION_REDUCTION,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.alternativeComplianceRoutes = {
          ...payload.noc.alternativeComplianceRoutes,
          totalEnergyConsumptionReduction: {
            energyConsumption: this.form.get('totalEnergyConsumptionReduction').value.energyConsumption ?? null,
            energyCost: getFixedCostOptional(this.form.get('totalEnergyConsumptionReduction').value.energyCost),
          },
        };
      }),
    });
  }
}
