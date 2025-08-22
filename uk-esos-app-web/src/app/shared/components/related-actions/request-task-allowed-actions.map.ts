import { RequestTaskActionProcessDTO } from 'esos-api';

const relatedRequestTaskActions: Array<RequestTaskActionProcessDTO['requestTaskActionType']> = [
  'RFI_SUBMIT',
  'RDE_SUBMIT',
  'RFI_CANCEL',
  'ACCOUNT_CLOSURE_CANCEL_APPLICATION',
  'ACTION_PLAN_CANCEL_APPLICATION',
  'PROGRESS_UPDATE_1_CANCEL_APPLICATION',
  'PROGRESS_UPDATE_2_CANCEL_APPLICATION',
];

export function hasRequestInfo(allowedRequestTaskActions: Array<RequestTaskActionProcessDTO['requestTaskActionType']>) {
  return allowedRequestTaskActions?.some((action) => relatedRequestTaskActions.includes(action));
}

export function requestTaskAllowedActions(
  allowedRequestTaskActions: Array<RequestTaskActionProcessDTO['requestTaskActionType']>,
  taskId: number,
  isWorkflow?: boolean,
) {
  return (
    allowedRequestTaskActions
      ?.filter((action) => relatedRequestTaskActions.includes(action))
      .map((action) => actionDetails(action, taskId, isWorkflow ? './' : '/')) ?? []
  );
}

function actionDetails(
  action: RequestTaskActionProcessDTO['requestTaskActionType'],
  taskId: number,
  routerLooks?: string,
) {
  switch (action) {
    case 'RFI_SUBMIT':
      return { text: 'Request for information', link: [routerLooks + 'rfi', taskId, 'questions'] };
    case 'RDE_SUBMIT':
      return {
        text: 'Request deadline extension',
        link: [routerLooks + 'rde', taskId, 'extend-determination'],
      };
    case 'RFI_CANCEL':
      return { text: 'Cancel request', link: [routerLooks + 'rfi', taskId, 'cancel-verify'] };
    case 'ACCOUNT_CLOSURE_CANCEL_APPLICATION':
    case 'ACTION_PLAN_CANCEL_APPLICATION':
    case 'PROGRESS_UPDATE_1_CANCEL_APPLICATION':
    case 'PROGRESS_UPDATE_2_CANCEL_APPLICATION':
      return { text: 'Cancel task', link: ['cancel'] };

    default:
      return null;
  }
}
