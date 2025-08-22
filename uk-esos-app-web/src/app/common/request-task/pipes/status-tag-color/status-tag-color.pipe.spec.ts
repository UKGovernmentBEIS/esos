import { TaskItemStatus } from '@tasks/task-item-status';

import { StatusTagColorPipe } from './status-tag-color.pipe';

describe('StatusTagColorPipe', () => {
  it('create an instance', () => {
    const pipe = new StatusTagColorPipe();

    expect(pipe).toBeTruthy();
  });

  it('should transform colors based on status', () => {
    const pipe = new StatusTagColorPipe();

    expect(pipe.transform(TaskItemStatus.NOT_STARTED)).toBe('grey');
    expect(pipe.transform(TaskItemStatus.CANNOT_START_YET)).toBe('grey');
    expect(pipe.transform(TaskItemStatus.TERMINATED)).toBe('grey');
    expect(pipe.transform(TaskItemStatus.COMPLETED)).toBe('green');
    expect(pipe.transform(TaskItemStatus.APPROVED)).toBe('green');
    expect(pipe.transform(TaskItemStatus.IN_PROGRESS)).toBe('blue');
    expect(pipe.transform(TaskItemStatus.REJECTED)).toBe('red');
  });
});
