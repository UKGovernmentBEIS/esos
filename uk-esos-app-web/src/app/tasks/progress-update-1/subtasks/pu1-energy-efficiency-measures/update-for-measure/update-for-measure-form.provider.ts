import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { progressUpdate1Query } from '@tasks/progress-update-1/+state/progress-update-1.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { getIntegerValidators } from '../pu1-energy-efficiency-measures.helper';

export const updateForMeasureFormProvider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (fb: FormBuilder, store: RequestTaskStore, route: ActivatedRoute) => {
    const measureIndex = route.snapshot.paramMap.get('measureIndex');
    const measureForUpdate = measureIndex
      ? store.select(progressUpdate1Query.selectMeasuresForUpdate)()?.[+measureIndex]
      : null;
    const update = measureForUpdate?.progressUpdate1P3EnergyEfficiencyMeasure;

    const reductionEnergyConsumption2024To2025 = [
      update?.reductionEnergyConsumption2024To2025 ?? null,
      getIntegerValidators(1, 'Enter the reduction in energy consumption between 6 December 2024 and 5 December 2025'),
    ];
    const estimationMethodType = [
      update?.estimationMethodType ?? null,
      {
        validators: GovukValidators.required('Select the method used to estimate the reduction in energy consumption'),
        updateOn: 'change',
      },
    ];
    const estimationMethodDescription = [
      update?.estimationMethodDescription ?? null,
      [
        GovukValidators.required('Enter the description'),
        GovukValidators.maxLength(10000, 'The description should not be longer than 10000 characters'),
      ],
    ];
    const providedContext = [update?.providedContext ?? null, { updateOn: 'change' }];

    if (measureForUpdate?.measureImplType === 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN') {
      return fb.group({
        reportReduction2024To2025: [
          update?.reportReduction2024To2025 ?? null,
          {
            validators: [
              GovukValidators.required(
                'Select yes if you want to report energy consumption reduction between 6 December 2024 and 5 December 2025',
              ),
            ],
            updateOn: 'change',
          },
        ],
        reductionEnergyConsumption2024To2025,
        reportReduction2023To2024: [
          update?.reportReduction2023To2024 ?? null,
          {
            validators: [
              GovukValidators.required(
                'Select yes if you want to report energy consumption reduction between 6 December 2023 and 5 December 2024',
              ),
            ],
            updateOn: 'change',
          },
        ],
        reductionEnergyConsumption2023To2024: [
          update?.reductionEnergyConsumption2023To2024 ?? null,
          getIntegerValidators(
            0,
            'Enter the reduction in energy consumption between 6 December 2023 and 5 December 2024',
          ),
        ],
        estimationMethodType,
        estimationMethodDescription,
        providedContext,
      });
    }

    return fb.group({
      measureIsImplemented: [
        update?.measureIsImplemented ?? null,
        {
          validators: [
            GovukValidators.required('Select yes if this measure has been implemented no later than 5 December 2025'),
          ],
          updateOn: 'change',
        },
      ],
      measureImplementedByTheDateInActionPlan: [
        update?.measureImplementedByTheDateInActionPlan ?? null,
        GovukValidators.required('Select yes if this measure was implemented by the date in the action plan'),
      ],
      reductionEnergyConsumption2024To2025,
      reductionEnergyConsumption2023To2024: [
        update?.reductionEnergyConsumption2023To2024 ?? null,
        getIntegerValidators(0),
      ],
      estimationMethodType,
      estimationMethodDescription,
      providedContext,
    });
  },
};
