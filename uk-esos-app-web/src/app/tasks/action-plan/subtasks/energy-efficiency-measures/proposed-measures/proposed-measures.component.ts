import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { ActionPlanTaskPayload } from '@tasks/action-plan/action-plan.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
  EnergyEfficiencyMeasuresStep,
} from '../energy-efficiency-measures.helper';
import { PROPOSED_MEASURES_CONTENT } from './proposed-measures-content';
import { proposedMeasuresFormProvider } from './proposed-measures-form.provider';

@Component({
  selector: 'esos-proposed-measures',
  standalone: true,
  imports: [ReactiveFormsModule, WizardStepComponent, SharedModule],
  templateUrl: './proposed-measures.component.html',
  providers: [proposedMeasuresFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposedMeasuresComponent {
  protected readonly heading = PROPOSED_MEASURES_CONTENT.title;
  protected readonly caption = ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
  protected readonly noMeasureContextLabel = PROPOSED_MEASURES_CONTENT.noMeasureContextLabel;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<ActionPlanTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: EnergyEfficiencyMeasuresStep.PROPOSED_MEASURES,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (!payload.actionPlanP3) {
          payload.actionPlanP3 = {} as any;
        }

        if (!payload.actionPlanP3.energyEfficiencyMeasure) {
          payload.actionPlanP3.energyEfficiencyMeasure = {} as any;
        }

        const haveEnergyEfficiencyMeasures = this.form.controls.haveEnergyEfficiencyMeasures.value;
        const noMeasureContext = this.form.controls.noMeasureContext.value;

        if (haveEnergyEfficiencyMeasures === false) {
          delete payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures;

          if (noMeasureContext) {
            payload.actionPlanP3.energyEfficiencyMeasure.noMeasureContext = noMeasureContext;
          }
        }

        if (haveEnergyEfficiencyMeasures === true || !noMeasureContext) {
          delete payload.actionPlanP3.energyEfficiencyMeasure.noMeasureContext;
        }

        payload.actionPlanP3.energyEfficiencyMeasure.haveEnergyEfficiencyMeasures = haveEnergyEfficiencyMeasures;
      }),
      applySideEffects: true,
    });
  }
}
