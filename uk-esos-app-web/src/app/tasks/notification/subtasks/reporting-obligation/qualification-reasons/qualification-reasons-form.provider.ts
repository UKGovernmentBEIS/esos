import { Provider } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { ReportingObligationDetails } from 'esos-api';

import { notificationQuery } from '../../../+state/notification.selectors';

export type QualificationReasonsFormModel = {
  qualificationReason: FormControl<ReportingObligationDetails['qualificationReasonType']>;
};

export const qualificationReasonsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [RequestTaskStore, FormBuilder],
  useFactory: (store: RequestTaskStore, fb: FormBuilder) => {
    const ro = store.select(notificationQuery.selectReportingObligation)();

    return fb.group<QualificationReasonsFormModel>(
      {
        qualificationReason: new FormControl(ro?.reportingObligationDetails?.qualificationReasonType ?? null, [
          GovukValidators.required('Select an option'),
        ]),
      },
      { updateOn: 'change' },
    );
  },
};
