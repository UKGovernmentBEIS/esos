import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { energySavingsOpportunityMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { getFixedCostOptional } from '@shared/utils/bignumber.utils';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { TextInputComponent } from 'govuk-components';

import {
  ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
  EnergySavingsOpportunitiesCurrentStep,
} from '../energy-savings-opportunity.helper';
import { energySavingsOpportunityImplementationReductionFormProvider } from './energy-savings-opportunity-implementation-reduction-form.provider';

@Component({
  selector: 'esos-energy-savings-opportunity-implementation-reduction',
  standalone: true,
  imports: [TextInputComponent, WizardStepComponent, ReactiveFormsModule],
  templateUrl: './energy-savings-opportunity-implementation-reduction.component.html',
  providers: [energySavingsOpportunityImplementationReductionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergySavingsOpportunityImplementationReductionComponent {
  protected readonly energySavingsOpportunityMap = energySavingsOpportunityMap;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
      currentStep: EnergySavingsOpportunitiesCurrentStep.STEP1,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energySavingsOpportunities = {
          ...payload.noc.energySavingsOpportunities,
          implementationEnergyConsumption: {
            energyConsumption: this.form.get('implementationEnergyConsumption').value.energyConsumption,
            energyCost: getFixedCostOptional(this.form.get('implementationEnergyConsumption').value.energyCost),
          },
        };
      }),
    });
  }
}
