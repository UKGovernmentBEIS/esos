import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { getEnergySavingsCategoriesTotalSum } from '@shared/components/energy-savings-categories-input/energy-savings-categories-input';
import { EnergySavingsCategoriesInputComponent } from '@shared/components/energy-savings-categories-input/energy-savings-categories-input.component';
import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import { EnergySavingsCategories } from 'esos-api';

import { ENERGY_SAVINGS_ACHIEVED_SUB_TASK, EnergySavingsAchievedCurrentStep } from '../energy-savings-achieved.helper';
import { energySavingsAchievedCategoriesFormProvider } from './energy-savings-achieved-categories-form.provider';

@Component({
  selector: 'esos-energy-savings-achieved-categories',
  templateUrl: './energy-savings-achieved-categories.component.html',
  standalone: true,
  imports: [
    GovukComponentsModule,
    ReactiveFormsModule,
    WizardStepComponent,
    EnergySavingsCategoriesInputComponent,
    NoDataEnteredPipe,
  ],
  providers: [energySavingsAchievedCategoriesFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergySavingsAchievedCategoriesComponent {
  private formData: Signal<EnergySavingsCategories> = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  totalkWh: Signal<number> = computed(() => getEnergySavingsCategoriesTotalSum(this.formData()));

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_SAVINGS_ACHIEVED_SUB_TASK,
      currentStep: EnergySavingsAchievedCurrentStep.CATEGORIES,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energySavingsAchieved = {
          ...payload.noc.energySavingsAchieved,
          energySavingsCategories: {
            ...this.form.value,
            total: this.totalkWh(),
          },
        };
      }),
    });
  }
}
