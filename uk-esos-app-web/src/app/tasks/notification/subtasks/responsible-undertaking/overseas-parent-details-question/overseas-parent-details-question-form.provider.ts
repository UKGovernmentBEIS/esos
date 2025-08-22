import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const overseasParentDetailsQuestionFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const hasOverseasParentDetails = store.select(notificationQuery.selectResponsibleUndertaking)()
      ?.hasOverseasParentDetails;

    return fb.group(
      {
        hasOverseasParentDetails: [
          hasOverseasParentDetails ?? null,
          [GovukValidators.required('Select Yes if the organisation has a parent company based outside of the UK')],
        ],
      },
      { updateOn: 'change' },
    );
  },
};
