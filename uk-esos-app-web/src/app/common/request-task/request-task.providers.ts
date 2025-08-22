import { inject, InjectionToken } from '@angular/core';

import { AuthStore } from '@core/store';

import { RequestTaskDTO, RequestTaskItemDTO } from 'esos-api';

import { requestTaskQuery, RequestTaskStore } from './+state';
import { RequestTaskIsEditableResolver, RequestTaskPageContentFactoryMap } from './request-task.types';

/**
 * @description
 * A map object whose keys are request task types and values are of type {@link RequestTaskPageContentFactory}
 * This is used to resolve the task page's content (sections, custom components etc.).
 * The factory function may optionally be passed an `injector` argument if it needs to use specific providers
 *
 * @see {RequestTaskPageContentFactoryMap}
 */
export const REQUEST_TASK_PAGE_CONTENT = new InjectionToken<RequestTaskPageContentFactoryMap>(
  'Request task page content',
);

/**
 * @description
 * An optional token used to customize the resolution of whether a task is editable or not.
 * By default, the page checks if current user is same as task assignee.
 * Use a custom provider if you want to customize behavior
 *
 * @see {RequestTaskIsEditableResolver}
 */
export const REQUEST_TASK_IS_EDITABLE_RESOLVER = new InjectionToken<RequestTaskIsEditableResolver>(
  'Request task isEditable resolver',
  {
    factory: () => {
      const store = inject(RequestTaskStore);
      const authStore = inject(AuthStore);

      return () => {
        const assigneeUserId = store.select(requestTaskQuery.selectAssigneeUserId)();
        const taskType = store.select(requestTaskQuery.selectRequestTaskType)();
        const allowedRequestTaskActions = store.select(requestTaskQuery.selectAllowedRequestTaskActions)();
        const userId = authStore.getState().userState?.userId;

        return assigneeUserId === userId && hasUserExecuteScopeOnRequestTask(taskType, allowedRequestTaskActions);
      };
    },
  },
);

function hasUserExecuteScopeOnRequestTask(
  taskType: RequestTaskDTO['type'],
  allowedPermissions: RequestTaskItemDTO['allowedRequestTaskActions'],
): boolean {
  return allowedTaskActionMap[taskType].every((type) => allowedPermissions.includes(type));
}

const allowedTaskActionMap: Record<RequestTaskDTO['type'], RequestTaskItemDTO['allowedRequestTaskActions']> = {
  ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW: [
    'ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION',
    'ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION',
  ],
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT: [
    'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT',
    'NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT',
    'NOTIFICATION_OF_COMPLIANCE_P3_SUBMIT_APPLICATION',
  ],
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT: [
    'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_EDIT',
    'NOTIFICATION_OF_COMPLIANCE_P3_RETURN_TO_SUBMIT',
  ],
  NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT: [],
  ACTION_PLAN_P3_APPLICATION_SUBMIT: [
    'ACTION_PLAN_P3_SAVE_APPLICATION_SUBMIT',
    'ACTION_PLAN_P3_SUBMIT_APPLICATION',
    'ACTION_PLAN_CANCEL_APPLICATION',
  ],
  ACCOUNT_CLOSURE_SUBMIT: [
    'ACCOUNT_CLOSURE_SAVE_APPLICATION_SUBMIT',
    'ACCOUNT_CLOSURE_SUBMIT_APPLICATION',
    'ACCOUNT_CLOSURE_CANCEL_APPLICATION',
  ],
  PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT: [
    'PROGRESS_UPDATE_1_P3_SAVE_APPLICATION_SUBMIT',
    'PROGRESS_UPDATE_1_P3_SUBMIT_APPLICATION',
    'PROGRESS_UPDATE_1_CANCEL_APPLICATION',
  ],
  PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT: [
    'PROGRESS_UPDATE_2_P3_SAVE_APPLICATION_SUBMIT',
    'PROGRESS_UPDATE_2_P3_SUBMIT_APPLICATION',
    'PROGRESS_UPDATE_2_CANCEL_APPLICATION',
  ],
};
