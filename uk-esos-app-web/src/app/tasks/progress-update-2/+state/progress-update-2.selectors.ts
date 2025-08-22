import { Provider } from '@angular/core';

import { requestTaskQuery, RequestTaskState } from '@common/request-task/+state';
import { createAggregateSelector, createDescendingSelector, StateSelector } from '@common/store';
import { PROGRESS_UPDATE_COMMON_QUERY, ProgressUpdateCommonQuery } from '@tasks/progress-update-common/+state';

import {
  GroupChange,
  ProgressUpdate2P3,
  ProgressUpdate2P3AddedMeasure,
  ProgressUpdate2P3UpdatedAddedMeasure,
  ProgressUpdate2P3UpdatedMeasure,
} from 'esos-api';

import { ProgressUpdate2TaskPayload } from '../progress-update-2.types';
import { isProgressUpdate2Completed } from '../progress-update-2-task-content';

const selectPayload: StateSelector<RequestTaskState, ProgressUpdate2TaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as ProgressUpdate2TaskPayload,
);

const selectProgressUpdate: StateSelector<RequestTaskState, ProgressUpdate2P3> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.progressUpdate2P3,
);

const selectIsDisaggregateUndertaking: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.isDisaggregateUndertaking,
);

const selectGroupChange: StateSelector<RequestTaskState, GroupChange> = createDescendingSelector(
  selectProgressUpdate,
  (progressUpdate2P3) => progressUpdate2P3?.groupChange,
);

const selectActionPlanMeasuresForUpdate: StateSelector<RequestTaskState, ProgressUpdate2P3UpdatedMeasure[]> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.progressUpdate2P3?.progressUpdate2P3MeasuresUpdate?.progressUpdate2P3Measures,
  );

const selectPu1AddedMeasuresForUpdate: StateSelector<RequestTaskState, ProgressUpdate2P3UpdatedAddedMeasure[]> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.progressUpdate2P3?.progressUpdate2P3MeasuresUpdate?.progressUpdate2P3UpdatedAddedMeasures,
  );

const selectMeasuresForUpdate: StateSelector<
  RequestTaskState,
  (ProgressUpdate2P3UpdatedMeasure | ProgressUpdate2P3UpdatedAddedMeasure)[]
> = createAggregateSelector(
  selectActionPlanMeasuresForUpdate,
  selectPu1AddedMeasuresForUpdate,
  (actionPlanMeasures, pu1AddedMeasures) => [...actionPlanMeasures, ...pu1AddedMeasures],
);

const selectAddedMeasures: StateSelector<RequestTaskState, ProgressUpdate2P3AddedMeasure[]> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.progressUpdate2P3?.progressUpdate2P3MeasuresUpdate?.progressUpdate2P3AddedMeasure,
);

const selectResponsibleOfficerConfirmation: StateSelector<
  RequestTaskState,
  ProgressUpdate2P3['responsibleOfficerConfirmation']
> = createDescendingSelector(selectPayload, (payload) => payload?.progressUpdate2P3?.responsibleOfficerConfirmation);

const selectProgressUpdate2SectionsCompleted: StateSelector<
  RequestTaskState,
  ProgressUpdate2TaskPayload['progressUpdate2P3SectionsCompleted']
> = createDescendingSelector(selectPayload, (payload) => payload?.progressUpdate2P3SectionsCompleted ?? {});

const selectCanSubmitProgressUpdate2: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectPayload,
  isProgressUpdate2Completed,
);

export const progressUpdate2Query = {
  selectPayload,
  selectProgressUpdate,
  selectIsDisaggregateUndertaking,
  selectGroupChange,
  selectMeasuresForUpdate,
  selectAddedMeasures,
  selectResponsibleOfficerConfirmation,
  selectProgressUpdate2SectionsCompleted,
  selectCanSubmitProgressUpdate2,
};

const pu2CommonQuery: ProgressUpdateCommonQuery = {
  selectProgressUpdate,
  selectIsDisaggregateUndertaking,
  selectGroupChange,
  selectResponsibleOfficerConfirmation,
  selectSectionsCompleted: selectProgressUpdate2SectionsCompleted,
};

export const pu2CommonQueryProvider: Provider = {
  provide: PROGRESS_UPDATE_COMMON_QUERY,
  useValue: pu2CommonQuery,
};
