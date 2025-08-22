import { InjectionToken } from '@angular/core';

import { RequestActionState, RequestActionStore } from '../request-action/+state';
import { RequestTaskState, RequestTaskStore } from '../request-task/+state';
import { createSelector, StateSelector } from './signal-store';

export const TYPE_AWARE_STORE = new InjectionToken<RequestTaskStore | RequestActionStore>('Type aware store');
export const ITEM_TYPE_TO_RETURN_TEXT_MAPPER = new InjectionToken<(type: string) => string>(
  'Item type to return-text mapper',
);

export const selectType: StateSelector<RequestTaskState | RequestActionState, string | null> = createSelector((state) =>
  'action' in state ? state.action?.type : 'requestTaskItem' in state ? state.requestTaskItem?.requestTask?.type : null,
);
