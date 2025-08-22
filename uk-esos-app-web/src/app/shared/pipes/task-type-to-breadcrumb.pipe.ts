import { Pipe, PipeTransform } from '@angular/core';

import { RequestTaskDTO } from 'esos-api';

@Pipe({
  name: 'taskTypeToBreadcrumb',
  standalone: true,
  pure: true,
})
export class TaskTypeToBreadcrumbPipe implements PipeTransform {
  transform(type: RequestTaskDTO['type']): string {
    switch (type) {
      case 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW':
        return 'Review organisation account application';
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT':
        return 'Submit Phase 3 notification';
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT':
        return 'Review Phase 3 notification';
      case 'NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT':
        return 'Awaiting external review of Phase 3 notification';
      case 'ACTION_PLAN_P3_APPLICATION_SUBMIT':
        return 'Submit Phase 3 Action Plan';
      case 'ACCOUNT_CLOSURE_SUBMIT':
        return 'Close account';
      case 'PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT':
        return 'Submit Phase 3 Progress Update 1';
      case 'PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT':
        return 'Submit Phase 3 Progress Update 2';

      default:
        return null;
    }
  }
}
