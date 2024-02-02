import { Pipe, PipeTransform } from '@angular/core';

import { RequestActionInfoDTO } from 'esos-api';

@Pipe({ name: 'timelineItemLink', pure: true, standalone: true })
export class TimelineItemLinkPipe implements PipeTransform {
  transform(value: RequestActionInfoDTO, isWorkflow?: boolean): any[] {
    const routerLooks = isWorkflow ? './' : '/';
    switch (value.type) {
      case 'ORGANISATION_ACCOUNT_OPENING_APPROVED':
      case 'ORGANISATION_ACCOUNT_OPENING_REJECTED':
        return [routerLooks + 'installation-account', 'submitted-decision', value.id];
      case 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED':
        return [routerLooks + 'installation-account', 'summary', value.id];

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

      default:
        throw new Error('Provide an action url');
    }
  }
}
