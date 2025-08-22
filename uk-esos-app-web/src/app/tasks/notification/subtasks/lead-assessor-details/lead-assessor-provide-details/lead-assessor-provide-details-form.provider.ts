import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { REQUEST_TASK_PAGE_CONTENT } from '@common/request-task/request-task.providers';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { GovukValidators } from 'govuk-components';

export const LeadAssessorProvideDetailsFormProvider: Provider = {
  provide: REQUEST_TASK_PAGE_CONTENT,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectLeadAssessor);
    const leadAssessorDetails = state()?.leadAssessorDetails;

    return fb.group({
      firstName: [
        leadAssessorDetails?.firstName ?? null,
        [
          GovukValidators.required(`Enter a first name`),
          GovukValidators.maxLength(255, 'First name should not be more than 255 characters'),
        ],
      ],
      lastName: [
        leadAssessorDetails?.lastName ?? null,
        [
          GovukValidators.required(`Enter a last name`),
          GovukValidators.maxLength(255, 'Last name should not be more than 255 characters'),
        ],
      ],
      email: [
        leadAssessorDetails?.email ?? null,
        [
          GovukValidators.required(`Enter an email address`),
          GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
          GovukValidators.maxLength(255, 'Email should not be more than 255 characters'),
        ],
      ],
      professionalBody: [
        leadAssessorDetails?.professionalBody ?? null,
        [GovukValidators.required(`Select the professional body`)],
      ],
      membershipNumber: [
        leadAssessorDetails?.membershipNumber ?? null,
        [
          GovukValidators.required(`Enter the membership Number`),
          GovukValidators.maxLength(255, 'Membership Number should not be more than 255 characters'),
        ],
      ],
    });
  },
};
