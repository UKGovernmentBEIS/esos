import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { map, merge, of, startWith, takeUntil, tap } from 'rxjs';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { BooleanRadioGroupComponent } from '@shared/boolean-radio-group/boolean-radio-group.component';
import { EnergyEfficiencyMeasureSummaryListTemplateComponent } from '@shared/components/summaries';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { progressUpdate1Query } from '@tasks/progress-update-1/+state/progress-update-1.selectors';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { FieldsetEstimationMethodTypeComponent } from '@tasks/progress-update-common/components/fieldset-estimation-method-type/fieldset-estimation-method-type.component';
import { FieldsetReductionEnergyConsumptionComponent } from '@tasks/progress-update-common/components/fieldset-reduction-energy-consumption/fieldset-reduction-energy-consumption.component';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import {
  EnergyEfficiencyMeasure,
  ProgressUpdate1P3EnergyEfficiencyMeasure,
  ProgressUpdate1P3UpdatedMeasure,
} from 'esos-api';

import {
  ProgressUpdate1EnergyEfficiencyMeasuresStep,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '../pu1-energy-efficiency-measures.helper';
import { UPDATE_FOR_MEASURE_FORM_CONTENT } from './update-for-measure-content';
import { updateForMeasureFormProvider } from './update-for-measure-form.provider';

@Component({
  selector: 'esos-update-for-measure',
  standalone: true,
  imports: [
    BooleanRadioGroupComponent,
    EnergyEfficiencyMeasureSummaryListTemplateComponent,
    FieldsetEstimationMethodTypeComponent,
    FieldsetReductionEnergyConsumptionComponent,
    GovukComponentsModule,
    ReactiveFormsModule,
    WizardStepComponent,
  ],
  templateUrl: './update-for-measure.component.html',
  providers: [updateForMeasureFormProvider, DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateForMeasureComponent {
  protected readonly caption = PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
  protected readonly contentMap = UPDATE_FOR_MEASURE_FORM_CONTENT;

  private get measureIsImplementedFormControl(): FormControl<boolean> {
    return this.form.get('measureIsImplemented') as FormControl<boolean>;
  }
  private get estimationMethodTypeFormControl(): FormControl<string> {
    return this.form.get('estimationMethodType') as FormControl<string>;
  }
  private get estimationMethodDescriptionFormControl(): FormControl<string> {
    return this.form.get('estimationMethodDescription') as FormControl<string>;
  }
  private get reportReduction2024To2025FormControl(): FormControl<boolean> {
    return this.form.get('reportReduction2024To2025') as FormControl<boolean>;
  }
  private get reportReduction2023To2024FormControl(): FormControl<boolean> {
    return this.form.get('reportReduction2023To2024') as FormControl<boolean>;
  }

  get shouldShowProvidedContext(): boolean {
    return this.measureImplType() === 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN'
      ? this.measureIsImplementedFormControl?.value === true || this.measureIsImplementedFormControl?.value === false
      : true;
  }

  get shouldShowEstimationMethodType(): boolean {
    return this.measureImplType() === 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN'
      ? this.reportReduction2024To2025FormControl?.value === true ||
          this.reportReduction2023To2024FormControl?.value === true
      : true;
  }

  title: Signal<string> = toSignal(this.route?.title || of(this.contentMap.title));

  private measureIndex: Signal<number> = toSignal(
    this.route.paramMap.pipe(map((params) => +params.get('measureIndex'))),
  );

  private measureForUpdate: Signal<ProgressUpdate1P3UpdatedMeasure> = computed(
    () => this.store.select(progressUpdate1Query.selectMeasuresForUpdate)()[this.measureIndex()],
  );
  actionPlanEnergyEfficiencyMeasure: Signal<EnergyEfficiencyMeasure> = computed(
    () => this.measureForUpdate()?.actionPlanEnergyEfficiencyMeasure,
  );
  measureImplType: Signal<ProgressUpdate1P3UpdatedMeasure['measureImplType']> = computed(
    () => this.measureForUpdate()?.measureImplType,
  );

  constructor(
    @Inject(TASK_FORM) readonly form: FormGroup,
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<ProgressUpdate1TaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly destroy$: DestroySubject,
  ) {
    this.bindEstimationMethodTypeToggle();
  }

  private bindEstimationMethodTypeToggle(): void {
    if (this.measureImplType() !== 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN') {
      return;
    }

    merge(
      this.reportReduction2024To2025FormControl.valueChanges,
      this.reportReduction2023To2024FormControl.valueChanges,
    )
      .pipe(
        startWith(null),
        tap(() => {
          if (this.shouldShowEstimationMethodType) {
            this.estimationMethodTypeFormControl.enable();

            if (this.estimationMethodTypeFormControl.value === 'OTHER_METHOD') {
              this.estimationMethodDescriptionFormControl.enable();
            }
          } else {
            this.estimationMethodTypeFormControl.disable();
            this.estimationMethodDescriptionFormControl.disable();
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  onSubmit() {
    const isEditMode = this.route?.snapshot.title === this.contentMap.editTitle;
    const updateForMeasure: ProgressUpdate1P3EnergyEfficiencyMeasure = { ...this.form.value };

    if (this.estimationMethodTypeFormControl.value !== 'OTHER_METHOD') {
      delete updateForMeasure.estimationMethodDescription;
    }

    this.service.saveSubtask({
      subtask: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: isEditMode
        ? ProgressUpdate1EnergyEfficiencyMeasuresStep.EDIT_UPDATE_FOR_MEASURE
        : ProgressUpdate1EnergyEfficiencyMeasuresStep.UPDATE_FOR_MEASURE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const measures = payload.progressUpdate1P3.progressUpdate1P3MeasuresUpdate.progressUpdate1P3Measures;
        measures[this.measureIndex()] = {
          ...measures[this.measureIndex()],
          progressUpdate1P3EnergyEfficiencyMeasure: { ...updateForMeasure },
        };
        return payload;
      }),
      applySideEffects: true,
    });
  }
}
