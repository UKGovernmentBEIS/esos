import { ActionTypeToBreadcrumbPipe } from './action-type-to-breadcrumb.pipe';

const map = {
  ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED: 'Original application submitted',
  ORGANISATION_ACCOUNT_OPENING_APPROVED: 'Organisation account approved',
  ORGANISATION_ACCOUNT_OPENING_REJECTED: 'Organisation account rejected',
  ORGANISATION_ACCOUNT_OPENING_CREATED: 'Original application created',

  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT: 'Notification sent for review',
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT: 'Notification returned',
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED: 'Notification submitted',

  ACTION_PLAN_P3_APPLICATION_SUBMITTED: 'Action Plan submitted',

  PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED: 'Progress update 1 submitted',

  PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED: 'Progress update 2 submitted',

  ACCOUNT_CLOSURE_APPLICATION_SUBMITTED: 'Account closed',
};

describe('ActionTypeToBreadcrumbPipe', () => {
  const pipe = new ActionTypeToBreadcrumbPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should display correct breadcrumb per type', () => {
    Object.keys(map).forEach((type) => {
      expect(pipe.transform(type as any)).toEqual(map[type]);
    });
    expect(pipe.transform('ACCOUNT_CLOSURE_APPLICATION_SUBMITTED', 'John Doe')).toEqual(
      map['ACCOUNT_CLOSURE_APPLICATION_SUBMITTED'] + ' by John Doe',
    );
  });
});
