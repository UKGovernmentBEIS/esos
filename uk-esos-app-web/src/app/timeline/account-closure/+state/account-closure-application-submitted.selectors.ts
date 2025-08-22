import { requestActionQuery, RequestActionState } from '@common/request-action/+state';
import { createDescendingSelector, StateSelector } from '@common/store';

import { AccountClosureApplicationTimelinePayload } from './account-closure-application-submitted.types';

const selectPayload: StateSelector<RequestActionState, AccountClosureApplicationTimelinePayload> =
  createDescendingSelector(
    requestActionQuery.selectActionPayload,
    (state) => state as AccountClosureApplicationTimelinePayload,
  );

const selectReason: StateSelector<RequestActionState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload.accountClosure?.reason,
);

const selectSubmissionDate: StateSelector<RequestActionState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload.submitDate,
);

export const accountClosureApplicationTimelineQuery = {
  selectPayload,
  selectReason,
  selectSubmissionDate,
};
