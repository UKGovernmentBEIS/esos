import { UntypedFormControl } from '@angular/forms';

import { activityCodeValidators } from '@shared/components/activity-codes-input/activity-codes-input.validators';

export const addCodeFormControl = (code?: string): UntypedFormControl => {
  return new UntypedFormControl(code ?? null, { validators: activityCodeValidators });
};
