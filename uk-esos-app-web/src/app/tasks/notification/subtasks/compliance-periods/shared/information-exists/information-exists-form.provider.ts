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

export const informationExistsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, COMPLIANCE_PERIOD_SUB_TASK],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore, subtask: CompliancePeriod) => {
    const compliancePeriod =
      subtask === CompliancePeriodSubtask.FIRST
        ? store.select(notificationQuery.selectFirstCompliancePeriod)()
        : store.select(notificationQuery.selectSecondCompliancePeriod)();

    return fb.group({
      informationExists: [compliancePeriod?.informationExists, GovukValidators.required('Please select an option')],
    });
  },
};
