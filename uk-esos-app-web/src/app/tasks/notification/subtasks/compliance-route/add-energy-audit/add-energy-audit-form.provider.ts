import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { EnergyAudit } from 'esos-api';

export const addEnergyAuditFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore, route: ActivatedRoute) => {
    let editEnergyAudit: EnergyAudit;
    const index = +route.snapshot.params.index;

    if (index) {
      editEnergyAudit = store
        .select(notificationQuery.selectComplianceRoute)()
        .energyAudits.find((_, i) => i === index - 1);
    }

    return fb.group({
      description: [
        editEnergyAudit?.description ?? null,
        [
          GovukValidators.required('Enter the description'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ],
      numberOfSitesCovered: [
        editEnergyAudit?.numberOfSitesCovered ?? null,
        [GovukValidators.integerNumber(), GovukValidators.maxIntegersValidator()],
      ],
      numberOfSitesVisited: [
        editEnergyAudit?.numberOfSitesVisited ?? null,
        [
          GovukValidators.required('Enter the number of sites visited'),
          GovukValidators.integerNumber(),
          GovukValidators.maxIntegersValidator(),
        ],
      ],
      reason: [
        editEnergyAudit?.reason ?? null,
        [
          GovukValidators.required('Enter the reason'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ],
    });
  },
};
