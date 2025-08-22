import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@common/forms/services/task.service';
import { getEnergyConsumptionTotalSum } from '@shared/components/energy-consumption-input/energy-consumption-input';
import { EnergyConsumptionInputComponent } from '@shared/components/energy-consumption-input/energy-consumption-input.component';
import { OtherEstimationMethodHelpComponent } from '@shared/components/other-estimation-method-help/other-estimation-method-help.component';
import { EstimationMethodTypePipe } from '@shared/pipes/estimation-method-type.pipe';
import { MeasureSchemePipe } from '@shared/pipes/measure-scheme.pipe';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { YearMonthSelectComponent } from '@shared/year-month-select';
import { ActionPlanTaskPayload } from '@tasks/action-plan/action-plan.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
  EnergyEfficiencyMeasuresStep,
} from '../energy-efficiency-measures.helper';
import { MEASURE_FORM_CONTENT } from './measure-content';
import { MAX_DATE, measureFormProvider, MIN_DATE } from './measure-form.provider';

@Component({
  selector: 'esos-measure',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    SharedModule,
    EnergyConsumptionInputComponent,
    EstimationMethodTypePipe,
    MeasureSchemePipe,
    YearMonthSelectComponent,
    OtherEstimationMethodHelpComponent,
  ],
  templateUrl: './measure.component.html',
  styleUrl: './measure.component.scss',
  providers: [measureFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasureComponent {
  protected readonly caption = ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
  protected readonly contentMap = MEASURE_FORM_CONTENT;

  readonly minDate = MIN_DATE;
  readonly maxDate = MAX_DATE;

  private get measureSchemeFormControl(): FormControl<string[]> {
    return this.form.get('measureScheme') as FormControl<string[]>;
  }
  private get energySavingsEstimateCalculatedTypeFormControl(): FormControl<string> {
    return this.form.get('energySavingsEstimateCalculatedType') as FormControl<string>;
  }
  get totalEnergySavingsExpectedFormGroup(): FormGroup {
    return this.form.get('totalEnergySavingsExpected') as FormGroup;
  }
  private totalEnergySavingsExpectedData = toSignal(this.totalEnergySavingsExpectedFormGroup.valueChanges, {
    initialValue: this.totalEnergySavingsExpectedFormGroup.value,
  });

  totalkWh: Signal<number> = computed(() => getEnergyConsumptionTotalSum(this.totalEnergySavingsExpectedData()));

  title: Signal<string> = toSignal(this.route?.title || of(this.contentMap.title));

  constructor(
    @Inject(TASK_FORM) readonly form: FormGroup,
    private readonly service: TaskService<ActionPlanTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    const totalEnergySavingsExpected = {
      buildings: +this.totalEnergySavingsExpectedFormGroup.get('buildings').value,
      transport: +this.totalEnergySavingsExpectedFormGroup.get('transport').value,
      industrialProcesses: +this.totalEnergySavingsExpectedFormGroup.get('industrialProcesses').value,
      otherProcesses: +this.totalEnergySavingsExpectedFormGroup.get('otherProcesses').value,
      total: this.totalkWh(),
    };

    const energyEfficiencyMeasure = { ...this.form.value, totalEnergySavingsExpected };

    if (this.energySavingsEstimateCalculatedTypeFormControl.value !== 'OTHER_REASONABLE_ESTIMATION_METHOD') {
      delete energyEfficiencyMeasure.estimationMethodDescription;
    }
    if (!this.measureSchemeFormControl.value.includes('OTHER')) {
      delete energyEfficiencyMeasure.otherMeasureSchemeName;
    }

    const measureIndex = this.route.snapshot.paramMap.get('measureIndex');

    this.service.saveSubtask({
      subtask: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: measureIndex ? EnergyEfficiencyMeasuresStep.EDIT_MEASURE : EnergyEfficiencyMeasuresStep.MEASURE_FORM,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (!payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures) {
          payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures = [];
        }

        if (measureIndex && payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures[measureIndex]) {
          payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures[measureIndex] = energyEfficiencyMeasure;
        } else {
          payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures = [
            ...payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures,
            energyEfficiencyMeasure,
          ];
        }
      }),
      applySideEffects: true,
    });
  }
}
