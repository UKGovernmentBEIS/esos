import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { progressUpdate1Query } from '@tasks/progress-update-1/+state/progress-update-1.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { getIntegerValidators } from '../pu1-energy-efficiency-measures.helper';

export const newMeasureFormProvider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (fb: FormBuilder, store: RequestTaskStore, route: ActivatedRoute) => {
    const measureIndex = route.snapshot.paramMap.get('measureIndex');
    const measure = measureIndex ? store.select(progressUpdate1Query.selectAddedMeasures)()?.[+measureIndex] : null;

    return fb.group({
      measureName: [
        measure?.measureName ?? '',
        [
          GovukValidators.required('Enter the measure name'),
          GovukValidators.maxLength(255, 'The measure name should not be longer than 255 characters'),
        ],
      ],
      measureScheme: [measure?.measureScheme ?? [], { updateOn: 'change' }],
      otherMeasureSchemeName: [
        measure?.otherMeasureSchemeName ?? null,
        [GovukValidators.maxLength(255, 'The measure scheme name should not be longer than 255 characters')],
      ],
      reductionEnergyConsumption2024To2025: [
        measure?.reductionEnergyConsumption2024To2025 ?? null,
        getIntegerValidators(
          1,
          'Enter the reduction in energy consumption between 6 December 2024 and 5 December 2025',
        ),
      ],
      reductionEnergyConsumption2023To2024: [
        measure?.reductionEnergyConsumption2023To2024 ?? null,
        getIntegerValidators(0),
      ],
      estimationMethodType: [
        measure?.estimationMethodType ?? null,
        {
          validators: GovukValidators.required(
            'Select the method used to estimate the reduction in energy consumption',
          ),
          updateOn: 'change',
        },
      ],
      estimationMethodDescription: [
        measure?.estimationMethodDescription ?? null,
        [
          GovukValidators.required('Enter the description'),
          GovukValidators.maxLength(10000, 'The description should not be longer than 10000 characters'),
        ],
      ],
      measureContext: [measure?.measureContext ?? null, { updateOn: 'change' }],
    });
  },
};
