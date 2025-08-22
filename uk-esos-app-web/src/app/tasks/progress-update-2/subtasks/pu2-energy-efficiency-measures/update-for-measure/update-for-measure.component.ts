import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { map, of, startWith, takeUntil, tap } from 'rxjs';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { BooleanRadioGroupComponent } from '@shared/boolean-radio-group/boolean-radio-group.component';
import {
  EnergyEfficiencyMeasureSummaryListTemplateComponent,
  ProgressUpdate1AddedMeasureSummaryTemplateComponent,
  ProgressUpdate1UpdateForMeasureSummaryTemplateComponent,
} from '@shared/components/summaries';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { progressUpdate2Query } from '@tasks/progress-update-2/+state/progress-update-2.selectors';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';
import { FieldsetEstimationMethodTypeComponent } from '@tasks/progress-update-common/components/fieldset-estimation-method-type/fieldset-estimation-method-type.component';
import { FieldsetReductionEnergyConsumptionComponent } from '@tasks/progress-update-common/components/fieldset-reduction-energy-consumption/fieldset-reduction-energy-consumption.component';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent, GovukComponentsModule } from 'govuk-components';

import {
  EnergyEfficiencyMeasure,
  ProgressUpdate1P3AddedMeasure,
  ProgressUpdate1P3EnergyEfficiencyMeasure,
  ProgressUpdate2P3EnergyEfficiencyMeasure,
  ProgressUpdate2P3UpdatedAddedMeasure,
  ProgressUpdate2P3UpdatedMeasure,
} from 'esos-api';

import {
  isActionPlanMeasure,
  ProgressUpdate2EnergyEfficiencyMeasuresStep,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '../pu2-energy-efficiency-measures.helper';
import { UPDATE_FOR_MEASURE_FORM_CONTENT } from './update-for-measure-content';
import { updateForMeasureFormProvider } from './update-for-measure-form.provider';

@Component({
  selector: 'esos-update-for-measure',
  standalone: true,
  imports: [
    BooleanRadioGroupComponent,
    DetailsComponent,
    EnergyEfficiencyMeasureSummaryListTemplateComponent,
    FieldsetEstimationMethodTypeComponent,
    FieldsetReductionEnergyConsumptionComponent,
    GovukComponentsModule,
    ProgressUpdate1AddedMeasureSummaryTemplateComponent,
    ProgressUpdate1UpdateForMeasureSummaryTemplateComponent,
    ReactiveFormsModule,
    WizardStepComponent,
  ],
  templateUrl: './update-for-measure.component.html',
  providers: [updateForMeasureFormProvider, DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateForMeasureComponent {
  protected readonly caption = PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
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
  private get reportReduction2025To2026FormControl(): FormControl<boolean> {
    return this.form.get('reportReduction2025To2026') as FormControl<boolean>;
  }

  get shouldShowProvidedContext(): boolean {
    return !this.wasMeasureImplemented()
      ? this.measureIsImplementedFormControl?.value === true || this.measureIsImplementedFormControl?.value === false
      : true;
  }

  get shouldShowEstimationMethodType(): boolean {
    return this.wasMeasureImplemented() ? this.reportReduction2025To2026FormControl?.value === true : true;
  }

  title: Signal<string> = toSignal(this.route?.title || of(this.contentMap.title));

  private measureIndex: Signal<number> = toSignal(
    this.route.paramMap.pipe(map((params) => +params.get('measureIndex'))),
  );

  private measureForUpdate: Signal<ProgressUpdate2P3UpdatedMeasure | ProgressUpdate2P3UpdatedAddedMeasure> = computed(
    () => this.store.select(progressUpdate2Query.selectMeasuresForUpdate)()[this.measureIndex()],
  );
  actionPlanMeasure: Signal<EnergyEfficiencyMeasure> = computed(
    () => (this.measureForUpdate() as ProgressUpdate2P3UpdatedMeasure)?.actionPlanEnergyEfficiencyMeasure,
  );
  progressUpdate1ForActionPlanMeasure: Signal<ProgressUpdate1P3EnergyEfficiencyMeasure> = computed(
    () => (this.measureForUpdate() as ProgressUpdate2P3UpdatedMeasure)?.progressUpdate1P3EnergyEfficiencyMeasure,
  );
  progressUpdate1AddedMeasure: Signal<ProgressUpdate1P3AddedMeasure> = computed(
    () => (this.measureForUpdate() as ProgressUpdate2P3UpdatedAddedMeasure)?.progressUpdate1P3AddedMeasure,
  );
  wasMeasureImplemented: Signal<boolean> = computed(() => {
    // returns true is the measure was implemented before PU1 submission date
    const measure = this.measureForUpdate();
    return !(
      isActionPlanMeasure(measure) && measure.progressUpdate1P3EnergyEfficiencyMeasure.measureIsImplemented === false
    );
  });

  estimationMethodTypeOptions: Signal<string[]> = computed(() =>
    this.progressUpdate1AddedMeasure()
      ? UPDATE_FOR_MEASURE_FORM_CONTENT.estimationMethodType.options.filter(
          (option) => option !== 'ACTION_PLAN_ESTIMATE',
        )
      : UPDATE_FOR_MEASURE_FORM_CONTENT.estimationMethodType.options,
  );

  constructor(
    @Inject(TASK_FORM) readonly form: FormGroup,
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<ProgressUpdate2TaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly destroy$: DestroySubject,
  ) {
    if (this.wasMeasureImplemented()) {
      this.bindEstimationMethodTypeToggle();
    }
  }

  private bindEstimationMethodTypeToggle(): void {
    this.reportReduction2025To2026FormControl.valueChanges
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
    const updateForMeasure: ProgressUpdate2P3EnergyEfficiencyMeasure = { ...this.form.value };

    if (this.estimationMethodTypeFormControl.value !== 'OTHER_METHOD') {
      delete updateForMeasure.estimationMethodDescription;
    }

    this.service.saveSubtask({
      subtask: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: isEditMode
        ? ProgressUpdate2EnergyEfficiencyMeasuresStep.EDIT_UPDATE_FOR_MEASURE
        : ProgressUpdate2EnergyEfficiencyMeasuresStep.UPDATE_FOR_MEASURE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const uuId = this.measureForUpdate().uuId;
        let measures: ProgressUpdate2P3UpdatedMeasure[] | ProgressUpdate2P3UpdatedAddedMeasure[] =
          payload.progressUpdate2P3.progressUpdate2P3MeasuresUpdate.progressUpdate2P3Measures;
        let measureIndex = measures.findIndex((measure) => measure.uuId === uuId);

        if (measureIndex === -1) {
          measures = payload.progressUpdate2P3.progressUpdate2P3MeasuresUpdate.progressUpdate2P3UpdatedAddedMeasures;
          measureIndex = measures.findIndex((measure) => measure.uuId === uuId);
        }

        if (measureIndex > -1) {
          measures[measureIndex] = {
            ...measures[measureIndex],
            progressUpdate2P3EnergyEfficiencyMeasure: { ...updateForMeasure },
          };
        }

        return payload;
      }),
      applySideEffects: true,
    });
  }
}
