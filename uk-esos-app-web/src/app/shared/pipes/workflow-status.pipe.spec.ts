import { WorkflowStatusPipe } from './workflow-status.pipe';

describe('WorkflowStatusPipe', () => {
  let pipe: WorkflowStatusPipe;

  beforeEach(() => (pipe = new WorkflowStatusPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform workflow statuses', () => {
    expect(pipe.transform('APPROVED')).toEqual('Approved');
    expect(pipe.transform('CANCELLED')).toEqual('Cancelled');
    expect(pipe.transform('COMPLETED')).toEqual('Completed');
    expect(pipe.transform('IN_PROGRESS')).toEqual('In Progress');
    expect(pipe.transform('REJECTED')).toEqual('Rejected');
    expect(pipe.transform('WITHDRAWN')).toEqual('Withdrawn');
    expect(pipe.transform('CLOSED')).toEqual('Closed');
    expect(pipe.transform('TERMINATED')).toEqual('Terminated');
    expect(pipe.transform(undefined)).toEqual(null);
  });
});
