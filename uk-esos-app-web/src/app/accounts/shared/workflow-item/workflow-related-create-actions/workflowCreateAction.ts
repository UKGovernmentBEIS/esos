import { RequestCreateActionEmptyPayload, RequestCreateActionProcessDTO } from 'esos-api';

export const reinitiateTaskMap: Array<{
  requestCreateActionType: RequestCreateActionProcessDTO['requestCreateActionType'];
  taskTypePath: string;
  label: string;
  relatedActionLabel: string;
}> = [
  {
    requestCreateActionType: 'RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3',
    taskTypePath: 'noc',
    label: 'notification',
    relatedActionLabel: 'Return to participant for changes',
  },
  {
    requestCreateActionType: 'RE_INITIATE_ACTION_PLAN_P3',
    taskTypePath: 'action-plan',
    label: 'action plan',
    relatedActionLabel: 'Return to participant for changes',
  },
  {
    requestCreateActionType: 'RE_INITIATE_PROGRESS_UPDATE_1_P3',
    taskTypePath: 'progress-update-1',
    label: 'progress update 1',
    relatedActionLabel: 'Return to participant for changes',
  },
  {
    requestCreateActionType: 'RE_INITIATE_PROGRESS_UPDATE_2_P3',
    taskTypePath: 'progress-update-2',
    label: 'progress update 2',
    relatedActionLabel: 'Return to participant for changes',
  },
];

export function createRequestCreateActionProcessDTO(
  requestCreateActionType: RequestCreateActionProcessDTO['requestCreateActionType'],
  requestId: string,
): RequestCreateActionProcessDTO {
  switch (requestCreateActionType) {
    case 'RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3':
    case 'RE_INITIATE_ACTION_PLAN_P3':
    case 'RE_INITIATE_PROGRESS_UPDATE_1_P3':
    case 'RE_INITIATE_PROGRESS_UPDATE_2_P3':
      return {
        requestCreateActionType,
        requestCreateActionPayload: {
          payloadType: 'REPORT_RELATED_REQUEST_CREATE_ACTION_PAYLOAD',
          requestId: requestId,
        } as RequestCreateActionEmptyPayload,
      };
    default:
      return {
        requestCreateActionType,
        requestCreateActionPayload: {
          payloadType: 'EMPTY_PAYLOAD',
        } as RequestCreateActionEmptyPayload,
      };
  }
}
