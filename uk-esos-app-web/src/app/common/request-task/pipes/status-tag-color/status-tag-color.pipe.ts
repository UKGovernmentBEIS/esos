import { Pipe, PipeTransform } from '@angular/core';

import { TaskItemStatus } from '@tasks/task-item-status';

import { TagColor } from 'govuk-components';

@Pipe({
  name: 'statusTagColor',
  pure: true,
  standalone: true,
})
export class StatusTagColorPipe implements PipeTransform {
  transform(status: string): TagColor {
    switch (status) {
      case TaskItemStatus.NOT_STARTED:
      case TaskItemStatus.CANNOT_START_YET:
      case TaskItemStatus.TERMINATED:
        return 'grey';
      case TaskItemStatus.COMPLETED:
      case TaskItemStatus.APPROVED:
        return 'green';
      case TaskItemStatus.REJECTED:
        return 'red';
      case TaskItemStatus.IN_PROGRESS:
        return 'blue';
      default:
        return null;
    }
  }
}
