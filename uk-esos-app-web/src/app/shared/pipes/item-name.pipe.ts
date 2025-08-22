import { Pipe, PipeTransform } from '@angular/core';

import { ItemDTO } from 'esos-api';

@Pipe({ name: 'itemName', pure: true, standalone: true })
export class ItemNamePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: ItemDTO['taskType'], year?: string | number): string {
    switch (value) {
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
