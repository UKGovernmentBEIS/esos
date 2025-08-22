import { AbstractControl, UntypedFormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';
import { hasOtherEstimationMethod } from '@tasks/action-plan/action-plan-task-content';
import { TASK_FORM } from '@tasks/task-form.token';

export const reviewFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const responsibleOfficerConfirmation = store.select(actionPlanQuery.selectResponsibleOfficerConfirmation)();
    const energyEfficiencyMeasures = store.select(actionPlanQuery.selectEnergyEfficiencyMeasures)();
    const secondConfirmationRequired = hasOtherEstimationMethod(energyEfficiencyMeasures);

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
