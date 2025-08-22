import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { progressUpdate2Query } from '@tasks/progress-update-2/+state/progress-update-2.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { getIntegerValidators, isActionPlanMeasure } from '../pu2-energy-efficiency-measures.helper';

export const updateForMeasureFormProvider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (fb: FormBuilder, store: RequestTaskStore, route: ActivatedRoute) => {
    const measureIndex = route.snapshot.paramMap.get('measureIndex');
    const measureForUpdate = measureIndex
      ? store.select(progressUpdate2Query.selectMeasuresForUpdate)()?.[+measureIndex]
      : null;
    const update = measureForUpdate?.progressUpdate2P3EnergyEfficiencyMeasure;

    const reductionEnergyConsumption2025To2026 = [
      update?.reductionEnergyConsumption2025To2026 ?? null,
      getIntegerValidators(1, 'Enter the reduction in energy consumption between 6 December 2025 and 5 December 2026'),
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

    if (
      isActionPlanMeasure(measureForUpdate) &&
      measureForUpdate?.progressUpdate1P3EnergyEfficiencyMeasure?.measureIsImplemented === false
    ) {
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
        reductionEnergyConsumption2025To2026,
        estimationMethodType,
        estimationMethodDescription,
        providedContext,
      });
    }

    return fb.group({
      reportReduction2025To2026: [
        update?.reportReduction2025To2026 ?? null,
        {
          validators: [
            GovukValidators.required(
              'Select yes if you want to report energy consumption reduction between 6 December 2025 and 5 December 2026',
            ),
          ],
          updateOn: 'change',
        },
      ],
      reductionEnergyConsumption2025To2026,
      estimationMethodType,
      estimationMethodDescription,
      providedContext,
    });
  },
};
