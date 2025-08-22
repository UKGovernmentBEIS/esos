import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriod,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const potentialReductionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, COMPLIANCE_PERIOD_SUB_TASK],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore, subtask: CompliancePeriod) => {
    const compliancePeriod =
      subtask === CompliancePeriodSubtask.FIRST
        ? store.select(notificationQuery.selectFirstCompliancePeriod)()
        : store.select(notificationQuery.selectSecondCompliancePeriod)();
    const potentialReductionEnergyConsumption = compliancePeriod?.firstCompliancePeriodDetails?.potentialReduction;
    const numberValidators = [
      GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
      GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
      GovukValidators.maxDigitsValidator(15),
    ];
    return fb.group(
      {
        buildings: [potentialReductionEnergyConsumption?.buildings, numberValidators],
        transport: [potentialReductionEnergyConsumption?.transport, numberValidators],
        industrialProcesses: [potentialReductionEnergyConsumption?.industrialProcesses, numberValidators],
        otherProcesses: [potentialReductionEnergyConsumption?.otherProcesses, numberValidators],
      },
      { updateOn: 'change' },
    );
  },
};
