import { Pipe, PipeTransform } from '@angular/core';

import { ItemDTO } from 'esos-api';

@Pipe({ name: 'itemLink', pure: true, standalone: true })
export class ItemLinkPipe implements PipeTransform {
  transform(value: ItemDTO, isWorkflow?: boolean): any[] {
    if (isWorkflow) {
      return this.transformWorkflowUrl(value, '/accounts/' + value.accountId + '/workflows/' + value.requestId + '/');
    } else {
      return this.transformWorkflowUrl(value, '/');
    }
  }

  private transformWorkflowUrl(value: ItemDTO, routerLooks: string) {
    switch (value?.requestType) {
      case 'ORGANISATION_ACCOUNT_OPENING':
      case 'NOTIFICATION_OF_COMPLIANCE_P3':
      case 'ACTION_PLAN_P3':
      case 'ACCOUNT_CLOSURE':
      case 'PROGRESS_UPDATE_1_P3':
      case 'PROGRESS_UPDATE_2_P3':
        return [routerLooks + 'tasks', value.taskId];

      default:
        return ['.'];
    }
  }
}
