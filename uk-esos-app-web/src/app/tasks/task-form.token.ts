import { InjectionToken } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

export const TASK_FORM = new InjectionToken<UntypedFormGroup>('Task form');
