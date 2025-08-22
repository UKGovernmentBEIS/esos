import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const reductionAchievedFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const compliancePeriod = store.select(notificationQuery.selectSecondCompliancePeriod)();
    const energyConsumptionReductionAchieved = compliancePeriod?.reductionAchieved;
    const numberValidators = [
      GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
      GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
      GovukValidators.maxDigitsValidator(15),
    ];
    return fb.group(
      {
        buildings: [energyConsumptionReductionAchieved?.buildings, numberValidators],
        transport: [energyConsumptionReductionAchieved?.transport, numberValidators],
        industrialProcesses: [energyConsumptionReductionAchieved?.industrialProcesses, numberValidators],
        otherProcesses: [energyConsumptionReductionAchieved?.otherProcesses, numberValidators],
      },
      { updateOn: 'change' },
    );
  },
};
