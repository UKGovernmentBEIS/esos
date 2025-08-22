import { Pipe, PipeTransform } from '@angular/core';

import { RequestDetailsDTO } from 'esos-api';

@Pipe({ name: 'workflowStatus' })
export class WorkflowStatusPipe implements PipeTransform {
  transform(type: RequestDetailsDTO['requestStatus']): string {
    switch (type) {
      case 'APPROVED':
        return 'Approved';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'REJECTED':
        return 'Rejected';
      case 'WITHDRAWN':
        return 'Withdrawn';
      case 'CLOSED':
        return 'Closed';
      case 'TERMINATED':
        return 'Terminated';
      default:
        return null;
    }
  }
}
