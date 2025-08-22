import { FormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { getEnergyConsumptionTotalSum } from '@shared/components/energy-consumption-input/energy-consumption-input';
import {
  endYearMonthDateValidator,
  startYearMonthDateValidator,
} from '@shared/year-month-select/year-month-select.validators';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const MIN_DATE: Date = new Date(2023, 11, 1);
export const MAX_DATE: Date = new Date(2027, 11, 5);

export const measureFormProvider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (fb: FormBuilder, store: RequestTaskStore, route: ActivatedRoute) => {
    const measureIndex = route.snapshot.paramMap.get('measureIndex');
    const energyEfficiencyMeasure = measureIndex
      ? store.select(actionPlanQuery.selectEnergyEfficiencyMeasures)()?.[measureIndex]
      : null;

    return fb.group({
      measureName: [
        energyEfficiencyMeasure?.measureName ?? '',
        {
          validators: [
            GovukValidators.required('Enter the measure name'),
            GovukValidators.maxLength(255, 'The measure name should not be longer than 255 characters'),
          ],
        },
      ],
      isEnergySavingsOpportunityReportedInAudit: [
        energyEfficiencyMeasure?.isEnergySavingsOpportunityReportedInAudit ?? null,
        GovukValidators.required(
          'Select yes if this measure is a result of an energy savings opportunity reported in an energy audit',
        ),
      ],
      measureScheme: [energyEfficiencyMeasure?.measureScheme ?? [], { updateOn: 'change' }],
      otherMeasureSchemeName: [
        energyEfficiencyMeasure?.otherMeasureSchemeName ?? null,
        {
          validators: [
            GovukValidators.maxLength(255, 'The measure scheme name should not be longer than 255 characters'),
          ],
        },
      ],
      totalEnergySavingsExpected: fb.group(
        {
          buildings: [energyEfficiencyMeasure?.totalEnergySavingsExpected.buildings ?? null, numberValidators],
          transport: [energyEfficiencyMeasure?.totalEnergySavingsExpected.transport ?? null, numberValidators],
          industrialProcesses: [
            energyEfficiencyMeasure?.totalEnergySavingsExpected.industrialProcesses ?? null,
            numberValidators,
          ],
          otherProcesses: [
            energyEfficiencyMeasure?.totalEnergySavingsExpected.otherProcesses ?? null,
            numberValidators,
          ],
        },
        {
          validators: totalValueGreaterThanZero(),
          updateOn: 'change',
        },
      ),
      implementationDateForMeasure: [
        energyEfficiencyMeasure?.implementationDateForMeasure ?? null,
        [
          GovukValidators.required('Select implementation date for the measure'),
          startYearMonthDateValidator('The deadline cannot be earlier than December 2023', MIN_DATE),
          endYearMonthDateValidator('The deadline cannot be later than December 2027', MAX_DATE),
        ],
      ],
      energySavingsEstimateCalculatedType: [
        energyEfficiencyMeasure?.energySavingsEstimateCalculatedType ?? null,
        {
          validators: GovukValidators.required('Select how was the total energy savings estimate calculated'),
          updateOn: 'change',
        },
      ],
      estimationMethodDescription: [
        energyEfficiencyMeasure?.estimationMethodDescription ?? null,
        {
          validators: [
            GovukValidators.required('Enter the description'),
            GovukValidators.maxLength(10000, 'The description should not be longer than 10000 characters'),
          ],
        },
      ],
      measureContext: [energyEfficiencyMeasure?.measureContext ?? null, { updateOn: 'change' }],
    });
  },
};

const numberValidators = [
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
  GovukValidators.maxDigitsValidator(15),
];

function totalValueGreaterThanZero(): ValidatorFn {
  return (group: UntypedFormGroup): ValidationErrors => {
    const total = getEnergyConsumptionTotalSum(group.value);
    return total <= 0 || Number.isNaN(total)
      ? { invalidTotal: 'Total estimated energy savings must be greater than 0 kWh' }
      : null;
  };
}
