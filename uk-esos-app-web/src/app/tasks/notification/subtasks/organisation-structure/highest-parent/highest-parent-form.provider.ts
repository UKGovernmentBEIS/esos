import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { OrganisationStructure } from 'esos-api';

export const highestParentFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const organisationStructure =
      store.select(notificationQuery.selectOrganisationStructure)() ?? ({} as OrganisationStructure);

    return fb.group({
      isHighestParent: [
        organisationStructure.isHighestParent,
        GovukValidators.required(
          'Select yes if the responsible undertaking is a highest UK parent which has agreed in writing to aggregate with one or more other highest UK parents in its corporate group, so that their highest UK parent groups can comply as one participant',
        ),
      ],
    });
  },
};
