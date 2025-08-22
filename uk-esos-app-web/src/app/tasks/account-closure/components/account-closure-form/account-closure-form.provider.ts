import { FormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { accountClosureQuery } from '@tasks/account-closure/+state/account-closure.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const accountClosureFormProvider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (fb: FormBuilder, store: RequestTaskStore) => {
    const reason = store.select(accountClosureQuery.selectReason)();

    return fb.group({
      reason: [reason ?? '', GovukValidators.required('Enter a reason for closing the account')],
    });
  },
};
