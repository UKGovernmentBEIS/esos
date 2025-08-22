import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { OrganisationStructure } from 'esos-api';

export const includeUndertakingsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const organisationStructure =
      store.select(notificationQuery.selectOrganisationStructure)() ?? ({} as OrganisationStructure);

    return fb.group({
      isNonComplyingUndertakingsIncluded: [
        organisationStructure.isNonComplyingUndertakingsIncluded,
        GovukValidators.required(
          'Select yes if the responsible undertaking’s group include any undertakings on 31 December 2022 which either disaggregated from, or ceased to be part of the participant before 5 June 2024 and which are not complying as if they were still a member of the participant',
        ),
      ],
    });
  },
};
