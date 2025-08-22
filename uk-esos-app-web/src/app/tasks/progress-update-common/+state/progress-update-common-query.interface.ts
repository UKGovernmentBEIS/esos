import { InjectionToken } from '@angular/core';

import { RequestTaskState } from '@common/request-task/+state';
import { StateSelector } from '@common/store';

import { GroupChange, ProgressUpdate1P3, ProgressUpdate2P3 } from 'esos-api';

// Used to provide state selectors for common subtasks in PU1 and PU2
export interface ProgressUpdateCommonQuery {
  selectProgressUpdate: StateSelector<RequestTaskState, ProgressUpdate1P3 | ProgressUpdate2P3>;
  selectIsDisaggregateUndertaking: StateSelector<RequestTaskState, boolean>;
  selectGroupChange: StateSelector<RequestTaskState, GroupChange>;
  selectResponsibleOfficerConfirmation: StateSelector<
    RequestTaskState,
    (ProgressUpdate1P3 | ProgressUpdate2P3)['responsibleOfficerConfirmation']
  >;
  selectSectionsCompleted: StateSelector<RequestTaskState, { [key: string]: string }>;
}

export const PROGRESS_UPDATE_COMMON_QUERY: InjectionToken<ProgressUpdateCommonQuery> =
  new InjectionToken<ProgressUpdateCommonQuery>('Progress update common query selectors');
