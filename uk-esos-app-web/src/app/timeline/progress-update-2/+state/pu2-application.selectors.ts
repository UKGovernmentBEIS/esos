import { requestActionQuery, RequestActionState } from '@common/request-action/+state';
import { createDescendingSelector, createSelector, StateSelector } from '@common/store';

import {
  GroupChange,
  ProgressUpdate2P3,
  ProgressUpdate2P3AddedMeasure,
  ProgressUpdate2P3UpdatedMeasure,
  RequestActionDTO,
} from 'esos-api';

import { ProgressUpdate2ApplicationTimelinePayload } from './pu2-application.types';

const selectAction: StateSelector<RequestActionState, RequestActionDTO> = createSelector(
  requestActionQuery.selectAction,
);

const selectPayload: StateSelector<RequestActionState, ProgressUpdate2ApplicationTimelinePayload> =
  createDescendingSelector(
    requestActionQuery.selectActionPayload,
    (state) => state as ProgressUpdate2ApplicationTimelinePayload,
  );

const selectIsDisaggregateUndertaking: StateSelector<RequestActionState, boolean> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.isDisaggregateUndertaking,
);

const selectGroupChange: StateSelector<RequestActionState, GroupChange> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.progressUpdate2P3?.groupChange,
);

const selectMeasuresForUpdate: StateSelector<RequestActionState, ProgressUpdate2P3UpdatedMeasure[]> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.progressUpdate2P3?.progressUpdate2P3MeasuresUpdate?.progressUpdate2P3Measures,
  );

const selectAddedMeasures: StateSelector<RequestActionState, ProgressUpdate2P3AddedMeasure[]> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.progressUpdate2P3?.progressUpdate2P3MeasuresUpdate?.progressUpdate2P3AddedMeasure,
  );

const selectResponsibleOfficerConfirmation: StateSelector<
  RequestActionState,
  ProgressUpdate2P3['responsibleOfficerConfirmation']
> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.progressUpdate2P3?.responsibleOfficerConfirmation ?? [],
);

export const progressUpdate2ApplicationTimelineQuery = {
  selectAction,
  selectPayload,
  selectIsDisaggregateUndertaking,
  selectGroupChange,
  selectMeasuresForUpdate,
  selectAddedMeasures,
  selectResponsibleOfficerConfirmation,
};
