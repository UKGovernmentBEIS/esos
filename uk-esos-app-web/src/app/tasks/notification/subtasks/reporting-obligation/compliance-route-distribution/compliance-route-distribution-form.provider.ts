import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { notificationQuery } from '../../../+state/notification.selectors';

export type ComplianceRouteDistributionFormModel = {
  iso50001Pct: FormControl<number>;
  displayEnergyCertificatePct: FormControl<number>;
  greenDealAssessmentPct: FormControl<number>;
  energyAuditsPct: FormControl<number>;
  energyNotAuditedPct: FormControl<number>;
};

export const complianceRouteDistributionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [RequestTaskStore, FormBuilder],
  useFactory: (store: RequestTaskStore, fb: FormBuilder) => {
    const ro = store.select(notificationQuery.selectReportingObligation)();
    const cdr = ro?.reportingObligationDetails?.complianceRouteDistribution;

    return fb.group<ComplianceRouteDistributionFormModel>(
      {
        iso50001Pct: new FormControl(cdr?.iso50001Pct ?? 0, [
          GovukValidators.required('The field cannot be empty'),
          GovukValidators.wholeNumber('Percentage must be a positive integer number'),
        ]),
        displayEnergyCertificatePct: new FormControl(cdr?.displayEnergyCertificatePct ?? 0, [
          GovukValidators.required('The field cannot be empty'),
          GovukValidators.wholeNumber('Percentage must be a positive integer number'),
        ]),
        greenDealAssessmentPct: new FormControl(cdr?.greenDealAssessmentPct ?? 0, [
          GovukValidators.required('The field cannot be empty'),
          GovukValidators.wholeNumber('Percentage must be a positive integer number'),
        ]),
        energyAuditsPct: new FormControl(cdr?.energyAuditsPct ?? 0, [
          GovukValidators.required('The field cannot be empty'),
          GovukValidators.wholeNumber('Percentage must be a positive integer number'),
        ]),
        energyNotAuditedPct: new FormControl(cdr?.energyNotAuditedPct ?? 0, [
          GovukValidators.required('The field cannot be empty'),
          GovukValidators.wholeNumber('Percentage must be a positive integer number'),
          GovukValidators.max(5, 'The Energy use  not covered by any compliance route must be up to 5 percent'),
        ]),
      },
      {
        updateOn: 'change',
        validators: [
          (control: FormGroup<ComplianceRouteDistributionFormModel>) => {
            const sum = Object.values(control.value)
              .map((v) => (isNaN(v) ? 0 : +v))
              .reduce((acc, p) => acc + p, 0);

            if (sum !== 100) {
              return { badTotal: 'The sum of the individual percentages should equate to 100 percent' };
            }

            return null;
          },
        ],
      },
    );
  },
};
