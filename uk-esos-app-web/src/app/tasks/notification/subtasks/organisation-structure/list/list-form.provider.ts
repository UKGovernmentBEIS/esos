import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { OrganisationStructure } from 'esos-api';

export const listFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const organisationStructure =
      store.select(notificationQuery.selectOrganisationStructure)() ?? ({} as OrganisationStructure);

    return fb.group({
      isGroupStructureChartProvided: [
        organisationStructure.isGroupStructureChartProvided,
        GovukValidators.required(
          'Select yes if you wish to provide a corporate group structure chart or other information setting out the relationship between the RU and relevant undertakings that comprise the participant',
        ),
      ],
    });
  },
};
