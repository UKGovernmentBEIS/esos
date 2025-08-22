import { requestActionQuery, RequestActionState } from '@common/request-action/+state';
import { createDescendingSelector, createSelector, StateSelector } from '@common/store';

import {
  GroupChange,
  ProgressUpdate1P3,
  ProgressUpdate1P3AddedMeasure,
  ProgressUpdate1P3UpdatedMeasure,
  RequestActionDTO,
} from 'esos-api';

import { ProgressUpdate1ApplicationTimelinePayload } from './pu1-application.types';

const selectAction: StateSelector<RequestActionState, RequestActionDTO> = createSelector(
  requestActionQuery.selectAction,
);

const selectPayload: StateSelector<RequestActionState, ProgressUpdate1ApplicationTimelinePayload> =
  createDescendingSelector(
    requestActionQuery.selectActionPayload,
    (state) => state as ProgressUpdate1ApplicationTimelinePayload,
  );

const selectIsDisaggregateUndertaking: StateSelector<RequestActionState, boolean> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.isDisaggregateUndertaking,
);

const selectGroupChange: StateSelector<RequestActionState, GroupChange> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.progressUpdate1P3?.groupChange,
);

const selectMeasuresForUpdate: StateSelector<RequestActionState, ProgressUpdate1P3UpdatedMeasure[]> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.progressUpdate1P3?.progressUpdate1P3MeasuresUpdate?.progressUpdate1P3Measures,
  );

const selectAddedMeasures: StateSelector<RequestActionState, ProgressUpdate1P3AddedMeasure[]> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.progressUpdate1P3?.progressUpdate1P3MeasuresUpdate?.progressUpdate1P3AddedMeasure,
  );

const selectResponsibleOfficerConfirmation: StateSelector<
  RequestActionState,
  ProgressUpdate1P3['responsibleOfficerConfirmation']
> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.progressUpdate1P3?.responsibleOfficerConfirmation ?? [],
);

export const progressUpdate1ApplicationTimelineQuery = {
  selectAction,
  selectPayload,
  selectIsDisaggregateUndertaking,
  selectGroupChange,
  selectMeasuresForUpdate,
  selectAddedMeasures,
  selectResponsibleOfficerConfirmation,
};
