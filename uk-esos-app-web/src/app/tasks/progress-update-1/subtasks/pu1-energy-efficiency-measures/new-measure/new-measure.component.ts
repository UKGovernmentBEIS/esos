import { ChangeDetectionStrategy, Component, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@common/forms/services/task.service';
import { MeasureSchemePipe } from '@shared/pipes/measure-scheme.pipe';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { FieldsetEstimationMethodTypeComponent } from '@tasks/progress-update-common/components/fieldset-estimation-method-type/fieldset-estimation-method-type.component';
import { FieldsetReductionEnergyConsumptionComponent } from '@tasks/progress-update-common/components/fieldset-reduction-energy-consumption/fieldset-reduction-energy-consumption.component';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import {
  ProgressUpdate1EnergyEfficiencyMeasuresStep,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '../pu1-energy-efficiency-measures.helper';
import { NEW_MEASURE_FORM_CONTENT } from './new-measure-content';
import { newMeasureFormProvider } from './new-measure-form.provider';

@Component({
  selector: 'esos-new-measure',
  standalone: true,
  imports: [
    FieldsetEstimationMethodTypeComponent,
    FieldsetReductionEnergyConsumptionComponent,
    GovukComponentsModule,
    MeasureSchemePipe,
    ReactiveFormsModule,
    WizardStepComponent,
  ],
  templateUrl: './new-measure.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [newMeasureFormProvider],
})
export class NewMeasureComponent {
  protected readonly caption = PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
  protected readonly contentMap = NEW_MEASURE_FORM_CONTENT;

  private get estimationMethodTypeFormControl(): FormControl<string> {
    return this.form.get('estimationMethodType') as FormControl<string>;
  }

  title: Signal<string> = toSignal(this.route?.title || of(this.contentMap.title));

  constructor(
    @Inject(TASK_FORM) readonly form: FormGroup,
    private readonly service: TaskService<ProgressUpdate1TaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    const measureIndex = this.route.snapshot.paramMap.get('measureIndex');
    const measure = { ...this.form.value };

    if (this.estimationMethodTypeFormControl.value !== 'OTHER_METHOD') {
      delete measure.estimationMethodDescription;
    }

    this.service.saveSubtask({
      subtask: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: measureIndex
        ? ProgressUpdate1EnergyEfficiencyMeasuresStep.EDIT_NEW_MEASURE
        : ProgressUpdate1EnergyEfficiencyMeasuresStep.ADD_NEW_MEASURE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const measures = payload.progressUpdate1P3.progressUpdate1P3MeasuresUpdate.progressUpdate1P3AddedMeasure;
        payload.progressUpdate1P3.progressUpdate1P3MeasuresUpdate.progressUpdate1P3AddedMeasure[
          measureIndex ?? measures.length
        ] = measure;
        return payload;
      }),
      applySideEffects: true,
    });
  }
}
