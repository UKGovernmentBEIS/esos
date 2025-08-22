import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  isDecEnabled,
  isGdaEnabled,
  isIso50001Enabled,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const assetsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectAlternativeComplianceRoutes);
    const assets = state()?.assets;
    const complianceRouteDistribution = store.select(notificationQuery.selectReportingObligation)()
      .reportingObligationDetails.complianceRouteDistribution;

    return fb.group({
      iso50001: [
        assets?.iso50001 ?? null,
        isIso50001Enabled(complianceRouteDistribution)
          ? GovukValidators.required('List the assets and activities')
          : null,
      ],
      dec: [
        assets?.dec ?? null,
        isDecEnabled(complianceRouteDistribution)
          ? GovukValidators.required('List the assets and activities')
          : null,
      ],
      gda: [
        assets?.gda ?? null,
        isGdaEnabled(complianceRouteDistribution)
          ? GovukValidators.required('List the assets and activities')
          : null,
      ],
    });
  },
};
