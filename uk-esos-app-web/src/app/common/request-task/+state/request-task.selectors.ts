import { pipe } from 'rxjs';

import {
  createAggregateSelector,
  createDescendingSelector,
  createSelector,
  StateSelector,
} from '@common/store/signal-store';
import { isBefore } from 'date-fns';
import produce from 'immer';

import {
  ItemDTO,
  RequestActionInfoDTO,
  RequestInfoDTO,
  RequestTaskDTO,
  RequestTaskItemDTO,
  RequestTaskPayload,
} from 'esos-api';

import { RequestTaskState } from './request-task.state';

type RequestTaskActions = RequestTaskItemDTO['allowedRequestTaskActions'];

const selectRequestTaskItem: StateSelector<RequestTaskState, RequestTaskItemDTO> = createSelector(
  (state) => state?.requestTaskItem,
);

const selectAllowedRequestTaskActions: StateSelector<
  RequestTaskState,
  RequestTaskItemDTO['allowedRequestTaskActions']
> = createDescendingSelector(selectRequestTaskItem, (state) => state?.allowedRequestTaskActions);

const selectRelatedActions: StateSelector<RequestTaskState, RequestTaskActions> = createDescendingSelector(
  selectRequestTaskItem,
  (state) => state?.allowedRequestTaskActions,
);

const selectRequestInfo: StateSelector<RequestTaskState, RequestInfoDTO> = createDescendingSelector(
  selectRequestTaskItem,
  (state) => state?.requestInfo,
);

const selectRequestId: StateSelector<RequestTaskState, string> = createDescendingSelector(
  selectRequestInfo,
  (state) => state?.id,
);

const selectRequestType: StateSelector<RequestTaskState, RequestInfoDTO['type']> = createDescendingSelector(
  selectRequestInfo,
  (state) => state?.type,
);

const selectRequestMetadata: StateSelector<RequestTaskState, RequestInfoDTO['requestMetadata']> =
  createDescendingSelector(selectRequestInfo, (state) => state?.requestMetadata);

const selectRequestTask: StateSelector<RequestTaskState, RequestTaskDTO> = createDescendingSelector(
  selectRequestTaskItem,
  (state) => state?.requestTask,
);

const selectRequestTaskId: StateSelector<RequestTaskState, number> = createDescendingSelector(
  selectRequestTask,
  (state) => state?.id,
);

const selectUserAssignCapable: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectRequestTaskItem,
  (state) => state?.userAssignCapable,
);

const selectRequestTaskPayload: StateSelector<RequestTaskState, RequestTaskPayload> = createDescendingSelector(
  selectRequestTask,
  (state) => state?.payload,
);

const selectAssigneeUserId: StateSelector<RequestTaskState, string> = createDescendingSelector(
  selectRequestTask,
  (state) => state?.assigneeUserId,
);

const selectAssigneeFullName: StateSelector<RequestTaskState, string> = createDescendingSelector(
  selectRequestTask,
  (state) => state?.assigneeFullName,
);

const selectRequestTaskType: StateSelector<RequestTaskState, RequestTaskDTO['type']> = createDescendingSelector(
  selectRequestTask,
  (state) => state?.type,
);

const selectRelatedTasks: StateSelector<RequestTaskState, ItemDTO[]> = createAggregateSelector(
  (state) => state?.relatedTasks,
  selectRequestTask,
  (relatedTasks, requestTask) =>
    relatedTasks?.filter((t) => {
      return t.taskId !== requestTask.id;
    }) ?? [],
);

const selectAccountOrganisationId: StateSelector<RequestTaskState, string> = createAggregateSelector(
  (state) => state?.relatedTasks,
  selectRequestTask,
  (relatedTasks, requestTask) => relatedTasks?.find((t) => t.taskId === requestTask.id)?.accountOrganisationId,
);

const selectTimeline: StateSelector<RequestTaskState, RequestActionInfoDTO[]> = createSelector((state) =>
  produce(state?.timeline, (timeline) =>
    timeline.sort((a, b) => (isBefore(new Date(a.creationDate), new Date(b.creationDate)) ? 1 : -1)),
  ),
);

const selectTaskReassignedTo: StateSelector<RequestTaskState, string> = pipe((state) => state?.taskReassignedTo);

const selectIsEditable: StateSelector<RequestTaskState, boolean> = createSelector((state) => state.isEditable);

const selectMetadata: StateSelector<RequestTaskState, { [key: string]: unknown }> = createSelector((state) => {
  return state.metadata;
});

export const requestTaskQuery = {
  selectRequestTaskItem,
  selectAllowedRequestTaskActions,
  selectRequestInfo,
  selectRequestId,
  selectRequestType,
  selectRequestMetadata,
  selectRequestTask,
  selectRequestTaskId,
  selectRequestTaskPayload,
  selectUserAssignCapable,
  selectAssigneeUserId,
  selectAssigneeFullName,
  selectRequestTaskType,
  selectRelatedTasks,
  selectRelatedActions,
  selectTimeline,
  selectTaskReassignedTo,
  selectIsEditable,
  selectMetadata,
  selectAccountOrganisationId,
};
