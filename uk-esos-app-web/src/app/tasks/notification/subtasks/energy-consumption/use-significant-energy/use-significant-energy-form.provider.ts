import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { isEnergyNotAuditedBelowFivePctValidator } from '@tasks/notification/subtasks/energy-consumption/energy-consumption.validators';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const useSignificantEnergyFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const exists = store.select(notificationQuery.selectEnergyConsumption)()?.significantEnergyConsumptionExists;
    const complianceRouteDistribution = store.select(notificationQuery.selectReportingObligation)()
      .reportingObligationDetails?.complianceRouteDistribution;
    return fb.group(
      {
        significantEnergyConsumptionExists: [exists, GovukValidators.required('Please select Yes or No')],
      },
      { validators: isEnergyNotAuditedBelowFivePctValidator(complianceRouteDistribution), updateOn: 'change' },
    );
  },
};
