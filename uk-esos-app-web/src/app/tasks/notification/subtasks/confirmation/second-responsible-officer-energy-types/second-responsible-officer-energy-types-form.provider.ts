import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { allCheckedValidator } from '../confirmation.validators';

export const SecondResponsibleOfficerEnergyTypesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectConfirmation);
    const secondResponsibleOfficerEnergyTypes = state()?.secondResponsibleOfficerEnergyTypes;

    return fb.group({
      secondResponsibleOfficerEnergyTypes: [secondResponsibleOfficerEnergyTypes ?? null, allCheckedValidator(4)],
    });
  },
};
