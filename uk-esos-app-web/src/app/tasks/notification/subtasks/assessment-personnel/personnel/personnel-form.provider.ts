import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const PersonFormFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder) => {
    return fb.group({
      firstName: [
        null,
        [
          GovukValidators.required('Enter a first name'),
          GovukValidators.maxLength(255, 'First name should not be more than 255 characters'),
        ],
      ],
      lastName: [
        null,
        [
          GovukValidators.required('Enter a last name'),
          GovukValidators.maxLength(255, 'Last name should not be more than 255 characters'),
        ],
      ],
      type: [null, [GovukValidators.required('Select if the person is internal or external to your corporate group')]],
    });
  },
};
