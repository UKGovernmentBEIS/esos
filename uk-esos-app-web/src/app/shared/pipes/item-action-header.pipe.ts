import { Pipe, PipeTransform } from '@angular/core';

import { RequestActionDTO, RequestActionInfoDTO } from 'esos-api';

import { ItemActionTypePipe } from './item-action-type.pipe';

@Pipe({ name: 'itemActionHeader', standalone: true, pure: true })
export class ItemActionHeaderPipe implements PipeTransform {
  transform(item: RequestActionDTO | RequestActionInfoDTO): string {
    const itemActionTypePipe = new ItemActionTypePipe();

    switch (item.type) {
      case 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;
      case 'ORGANISATION_ACCOUNT_OPENING_APPROVED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;
      case 'ORGANISATION_ACCOUNT_OPENING_REJECTED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;
      case 'ORGANISATION_ACCOUNT_OPENING_CREATED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;

      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT':
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT':
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RE_INITIATED':
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;

      case 'PAYMENT_MARKED_AS_PAID':
        return `Payment marked as paid by ${item.submitter} (BACS)`;
      case 'PAYMENT_CANCELLED':
      case 'PAYMENT_MARKED_AS_RECEIVED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;

      case 'RDE_ACCEPTED':
      case 'RDE_CANCELLED':
      case 'RDE_REJECTED':
      case 'RDE_FORCE_REJECTED':
      case 'RDE_FORCE_ACCEPTED':
      case 'RDE_SUBMITTED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;

      case 'RFI_CANCELLED':
      case 'RFI_RESPONSE_SUBMITTED':
      case 'RFI_SUBMITTED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;

      case 'ACTION_PLAN_P3_APPLICATION_RE_INITIATED':
      case 'ACTION_PLAN_P3_APPLICATION_SUBMITTED':
      case 'ACTION_PLAN_APPLICATION_CANCELLED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;

      case 'ACCOUNT_CLOSURE_APPLICATION_SUBMITTED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;
      case 'ACCOUNT_CLOSURE_APPLICATION_CANCELLED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;

      case 'PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED':
      case 'PROGRESS_UPDATE_1_P3_APPLICATION_RE_INITIATED':
      case 'PROGRESS_UPDATE_1_APPLICATION_CANCELLED':
      case 'PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED':
      case 'PROGRESS_UPDATE_2_P3_APPLICATION_RE_INITIATED':
      case 'PROGRESS_UPDATE_2_APPLICATION_CANCELLED':
        return `${itemActionTypePipe.transform(item.type)} by ${item.submitter}`;

      default:
        return itemActionTypePipe.transform(item.type);
    }
  }
}
