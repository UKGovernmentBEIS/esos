import { inject, Injectable } from '@angular/core';

import { RequestTaskPayload } from 'esos-api';

import { SideEffect } from './side-effect';
import { SIDE_EFFECTS } from './side-effects.providers';

@Injectable()
export class SideEffectsHandler {
  private sideEffects: SideEffect[] = inject(SIDE_EFFECTS, { optional: false });

  apply<T extends RequestTaskPayload>(subtask: string, payload: T): T;
  apply<T extends RequestTaskPayload>(subtask: string, step: string, payload: T): T;
  apply<T extends RequestTaskPayload>(...args: [string, T] | [string, string, T]): T {
    const subtask = args[0];
    const step = args.length === 3 ? args[1] : undefined;
    const payload = args[args.length - 1] as T;

    const sideEffectsToApply = this.sideEffects.filter(
      (se) => se.subtask === subtask && (se.step == null || se.step === step),
    );

    if (!sideEffectsToApply || sideEffectsToApply.length === 0) {
      return payload;
    } else {
      return sideEffectsToApply.reduce((acc, se) => se.apply(acc), payload);
    }
  }
}
