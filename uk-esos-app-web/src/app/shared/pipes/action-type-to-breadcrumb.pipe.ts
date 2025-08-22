import { Pipe, PipeTransform } from '@angular/core';

import { RequestActionDTO } from 'esos-api';

@Pipe({
  name: 'actionTypeToBreadcrumb',
  standalone: true,
  pure: true,
})
export class ActionTypeToBreadcrumbPipe implements PipeTransform {
  transform(type: RequestActionDTO['type'], submitter?: string): string {
    switch (type) {
      case 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED':
        return 'Original application submitted';
      case 'ORGANISATION_ACCOUNT_OPENING_APPROVED':
        return 'Organisation account approved';
      case 'ORGANISATION_ACCOUNT_OPENING_REJECTED':
        return 'Organisation account rejected';
      case 'ORGANISATION_ACCOUNT_OPENING_CREATED':
        return 'Original application created';

      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT':
        return 'Notification sent for review';
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT':
        return 'Notification returned';
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED':
        return 'Notification submitted';

      case 'ACTION_PLAN_P3_APPLICATION_SUBMITTED':
        return 'Action Plan submitted';

      case 'PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED':
        return 'Progress update 1 submitted';

      case 'PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED':
        return 'Progress update 2 submitted';

      case 'ACCOUNT_CLOSURE_APPLICATION_SUBMITTED':
        return submitter ? `Account closed by ${submitter}` : 'Account closed';

      default:
        return null;
    }
  }
}
