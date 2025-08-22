import { inject } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { PROGRESS_UPDATE_COMMON_QUERY } from '@tasks/progress-update-common/+state';
import { hasOtherEstimationMethod } from '@tasks/progress-update-common/pu-common.helpers';
import { TASK_FORM } from '@tasks/task-form.token';

export const reviewFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const puCommonQuery = inject(PROGRESS_UPDATE_COMMON_QUERY);
    const responsibleOfficerConfirmation = store.select(puCommonQuery.selectResponsibleOfficerConfirmation)();
    const secondConfirmationRequired = hasOtherEstimationMethod(store.select(puCommonQuery.selectProgressUpdate)());

    return fb.group({
      responsibleOfficerConfirmation: [
        responsibleOfficerConfirmation ?? [],
        allCheckedValidator(secondConfirmationRequired ? 2 : 1),
      ],
    });
  },
};

function allCheckedValidator(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return length !== control?.value?.length
      ? { notAllChecked: 'You must confirm all of these statements are true.' }
      : null;
  };
}
