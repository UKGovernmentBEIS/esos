import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import { EnergySavingsRecommendations } from 'esos-api';

import {
  ENERGY_SAVINGS_ACHIEVED_SUB_TASK,
  EnergySavingsAchievedCurrentStep,
  getTotalPercentageSum,
} from '../energy-savings-achieved.helper';
import { energySavingsAchievedRecommendationsFormProvider } from './energy-savings-achieved-recommendations-form.provider';

@Component({
  selector: 'esos-energy-savings-achieved-recommendations',
  templateUrl: './energy-savings-achieved-recommendations.component.html',
  standalone: true,
  imports: [GovukComponentsModule, NoDataEnteredPipe, ReactiveFormsModule, WizardStepComponent],
  providers: [energySavingsAchievedRecommendationsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergySavingsAchievedRecommendationsComponent {
  private formData: Signal<EnergySavingsRecommendations> = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  totalPercentage: Signal<number> = computed(() => getTotalPercentageSum(this.formData()));

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_SAVINGS_ACHIEVED_SUB_TASK,
      currentStep: EnergySavingsAchievedCurrentStep.RECOMMENDATIONS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energySavingsAchieved = {
          ...payload.noc.energySavingsAchieved,
          energySavingsRecommendations: {
            ...this.form.value,
            total: this.totalPercentage(),
          },
        };
      }),
    });
  }
}
