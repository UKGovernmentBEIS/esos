import { Provider } from '@angular/core';

import { requestTaskQuery, RequestTaskState } from '@common/request-task/+state';
import { createDescendingSelector, StateSelector } from '@common/store';
import { PROGRESS_UPDATE_COMMON_QUERY, ProgressUpdateCommonQuery } from '@tasks/progress-update-common/+state';

import {
  GroupChange,
  ProgressUpdate1P3,
  ProgressUpdate1P3AddedMeasure,
  ProgressUpdate1P3UpdatedMeasure,
} from 'esos-api';

import { ProgressUpdate1TaskPayload } from '../progress-update-1.types';
import { isProgressUpdate1Completed } from '../progress-update-1-task-content';

const selectPayload: StateSelector<RequestTaskState, ProgressUpdate1TaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as ProgressUpdate1TaskPayload,
);

const selectProgressUpdate: StateSelector<RequestTaskState, ProgressUpdate1P3> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.progressUpdate1P3,
);

const selectIsDisaggregateUndertaking: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.isDisaggregateUndertaking,
);

const selectGroupChange: StateSelector<RequestTaskState, GroupChange> = createDescendingSelector(
  selectProgressUpdate,
  (progressUpdate1P3) => progressUpdate1P3?.groupChange,
);

const selectMeasuresForUpdate: StateSelector<RequestTaskState, ProgressUpdate1P3UpdatedMeasure[]> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.progressUpdate1P3?.progressUpdate1P3MeasuresUpdate?.progressUpdate1P3Measures,
  );

const selectAddedMeasures: StateSelector<RequestTaskState, ProgressUpdate1P3AddedMeasure[]> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.progressUpdate1P3?.progressUpdate1P3MeasuresUpdate?.progressUpdate1P3AddedMeasure,
);

const selectResponsibleOfficerConfirmation: StateSelector<
  RequestTaskState,
  ProgressUpdate1P3['responsibleOfficerConfirmation']
> = createDescendingSelector(selectPayload, (payload) => payload?.progressUpdate1P3?.responsibleOfficerConfirmation);

const selectProgressUpdate1SectionsCompleted: StateSelector<
  RequestTaskState,
  ProgressUpdate1TaskPayload['progressUpdate1P3SectionsCompleted']
> = createDescendingSelector(selectPayload, (payload) => payload?.progressUpdate1P3SectionsCompleted ?? {});

const selectCanSubmitProgressUpdate1: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectPayload,
  isProgressUpdate1Completed,
);

export const progressUpdate1Query = {
  selectPayload,
  selectProgressUpdate,
  selectIsDisaggregateUndertaking,
  selectGroupChange,
  selectMeasuresForUpdate,
  selectAddedMeasures,
  selectResponsibleOfficerConfirmation,
  selectProgressUpdate1SectionsCompleted,
  selectCanSubmitProgressUpdate1,
};

const pu1CommonQuery: ProgressUpdateCommonQuery = {
  selectProgressUpdate,
  selectIsDisaggregateUndertaking,
  selectGroupChange,
  selectResponsibleOfficerConfirmation,
  selectSectionsCompleted: selectProgressUpdate1SectionsCompleted,
};

export const pu1CommonQueryProvider: Provider = {
  provide: PROGRESS_UPDATE_COMMON_QUERY,
  useValue: pu1CommonQuery,
};
