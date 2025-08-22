import { Pipe, PipeTransform } from '@angular/core';

import { RequestActionInfoDTO } from 'esos-api';

@Pipe({ name: 'timelineItemLink', pure: true, standalone: true })
export class TimelineItemLinkPipe implements PipeTransform {
  transform(value: RequestActionInfoDTO, isWorkflow?: boolean): any[] {
    const routerLooks = isWorkflow ? './' : '/';
    switch (value.type) {
      case 'ORGANISATION_ACCOUNT_OPENING_APPROVED':
      case 'ORGANISATION_ACCOUNT_OPENING_REJECTED':
      case 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED':
      case 'ORGANISATION_ACCOUNT_OPENING_CREATED':
        return [routerLooks + 'timeline', value.id];

      case 'PAYMENT_MARKED_AS_PAID':
        return [routerLooks + 'payment', 'actions', value.id, 'paid'];
      case 'PAYMENT_CANCELLED':
        return [routerLooks + 'payment', 'actions', value.id, 'cancelled'];
      case 'PAYMENT_MARKED_AS_RECEIVED':
        return [routerLooks + 'payment', 'actions', value.id, 'received'];
      case 'PAYMENT_COMPLETED':
        return [routerLooks + 'payment', 'actions', value.id, 'completed'];

      case 'RDE_ACCEPTED':
      case 'RDE_CANCELLED':
      case 'RDE_EXPIRED':
        return null;
      case 'RDE_FORCE_ACCEPTED':
      case 'RDE_FORCE_REJECTED':
        return [routerLooks + 'rde', 'action', value.id, 'rde-manual-approval-submitted'];
      case 'RDE_REJECTED':
        return [routerLooks + 'rde', 'action', value.id, 'rde-response-submitted'];
      case 'RDE_SUBMITTED':
        return [routerLooks + 'rde', 'action', value.id, 'rde-submitted'];

      case 'RFI_CANCELLED':
      case 'RFI_EXPIRED':
        return null;
      case 'RFI_RESPONSE_SUBMITTED':
        return [routerLooks + 'rfi', 'action', value.id, 'rfi-response-submitted'];
      case 'RFI_SUBMITTED':
        return [routerLooks + 'rfi', 'action', value.id, 'rfi-submitted'];

      case 'REQUEST_TERMINATED':
        return null;

      case 'VERIFICATION_STATEMENT_CANCELLED':
        return null;

      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT':
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT':
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED':
        return [routerLooks + 'timeline', value.id];
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RE_INITIATED':
        return null;

      case 'ACTION_PLAN_P3_APPLICATION_SUBMITTED':
        return [routerLooks + 'timeline', value.id];
      case 'ACTION_PLAN_P3_APPLICATION_RE_INITIATED':
      case 'ACTION_PLAN_APPLICATION_CANCELLED':
        return null;

      case 'ACCOUNT_CLOSURE_APPLICATION_SUBMITTED':
        return [routerLooks + 'timeline', value.id];
      case 'ACCOUNT_CLOSURE_APPLICATION_CANCELLED':
        return null;

      case 'PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED':
      case 'PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED':
        return [routerLooks + 'timeline', value.id];
      case 'PROGRESS_UPDATE_1_APPLICATION_CANCELLED':
      case 'PROGRESS_UPDATE_1_P3_APPLICATION_RE_INITIATED':
      case 'PROGRESS_UPDATE_2_APPLICATION_CANCELLED':
      case 'PROGRESS_UPDATE_2_P3_APPLICATION_RE_INITIATED':
        return null;

      default:
        throw new Error('Provide an action url');
    }
  }
}
