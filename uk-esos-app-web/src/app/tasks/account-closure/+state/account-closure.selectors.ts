import { requestTaskQuery, RequestTaskState } from '@common/request-task/+state';
import { createDescendingSelector, StateSelector } from '@common/store';

import { AccountClosureTaskPayload } from '../account-closure.types';

const selectPayload: StateSelector<RequestTaskState, AccountClosureTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as AccountClosureTaskPayload,
);

const selectReason: StateSelector<RequestTaskState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload.accountClosure?.reason,
);

export const accountClosureQuery = {
  selectPayload,
  selectReason,
};
