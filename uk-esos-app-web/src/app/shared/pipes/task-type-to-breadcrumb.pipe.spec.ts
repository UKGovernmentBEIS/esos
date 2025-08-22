import { TaskTypeToBreadcrumbPipe } from './task-type-to-breadcrumb.pipe';

describe('TaskTypeToBreadcrumbPipe', () => {
  const pipe = new TaskTypeToBreadcrumbPipe();

  it('should map task types to item names', () => {
    expect(pipe.transform('ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW')).toEqual(
      'Review organisation account application',
    );

    expect(pipe.transform('NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT')).toEqual('Submit Phase 3 notification');
    expect(pipe.transform('NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT')).toEqual('Review Phase 3 notification');
    expect(pipe.transform('NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT')).toEqual(
      'Awaiting external review of Phase 3 notification',
    );

    expect(pipe.transform('ACTION_PLAN_P3_APPLICATION_SUBMIT')).toEqual('Submit Phase 3 Action Plan');

    expect(pipe.transform('PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT')).toEqual('Submit Phase 3 Progress Update 1');
    expect(pipe.transform('PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT')).toEqual('Submit Phase 3 Progress Update 2');

    expect(pipe.transform(null)).toBeNull();
  });
});
