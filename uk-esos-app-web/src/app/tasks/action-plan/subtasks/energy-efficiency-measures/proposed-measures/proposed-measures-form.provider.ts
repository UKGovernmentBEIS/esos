import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const proposedMeasuresFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(actionPlanQuery.selectActionPlanEnergyEfficiencyMeasure);

    return fb.group({
      haveEnergyEfficiencyMeasures: [
        state()?.haveEnergyEfficiencyMeasures,
        {
          validators: GovukValidators.required(
            'Select yes if you have any energy efficiency measures to be implemented',
          ),
          updateOn: 'change',
        },
      ],
      noMeasureContext: [
        state()?.noMeasureContext ?? null,
        [GovukValidators.maxLength(10000, 'The text should not be longer than 10000 characters')],
      ],
    });
  },
};
