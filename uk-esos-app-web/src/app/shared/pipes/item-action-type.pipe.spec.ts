import { ItemActionTypePipe } from './item-action-type.pipe';

describe('ItemActionTypePipe', () => {
  let pipe: ItemActionTypePipe;

  beforeAll(() => (pipe = new ItemActionTypePipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform action types', () => {
    expect(pipe.transform('ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED')).toEqual(
      'Original application submitted',
    );

    expect(pipe.transform('ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED')).toEqual(
      'Original application submitted',
    );
    expect(pipe.transform('ORGANISATION_ACCOUNT_OPENING_APPROVED')).toEqual('Organisation account approved');
    expect(pipe.transform('ORGANISATION_ACCOUNT_OPENING_REJECTED')).toEqual('Organisation account rejected');
    expect(pipe.transform('ORGANISATION_ACCOUNT_OPENING_CREATED')).toEqual('Original application created');

    expect(pipe.transform('NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT')).toEqual(
      'Notification sent for review',
    );
    expect(pipe.transform('NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT')).toEqual(
      'Notification returned',
    );
    expect(pipe.transform('NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RE_INITIATED')).toEqual(
      'Notification returned for changes',
    );
    expect(pipe.transform('NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED')).toEqual('Notification submitted');

    expect(pipe.transform('PAYMENT_MARKED_AS_PAID')).toEqual('Payment marked as paid (BACS)');
    expect(pipe.transform('PAYMENT_CANCELLED')).toEqual('Payment task cancelled');
    expect(pipe.transform('PAYMENT_MARKED_AS_RECEIVED')).toEqual('Payment marked as received');
    expect(pipe.transform('PAYMENT_COMPLETED')).toEqual('Payment confirmed via GOV.UK pay');

    expect(pipe.transform('RDE_ACCEPTED')).toEqual('Deadline extension date accepted');
    expect(pipe.transform('RDE_CANCELLED')).toEqual('Deadline extension date rejected');
    expect(pipe.transform('RDE_REJECTED')).toEqual('Deadline extension date rejected');
    expect(pipe.transform('RDE_FORCE_REJECTED')).toEqual('Deadline extension date rejected');
    expect(pipe.transform('RDE_EXPIRED')).toEqual('Deadline extension date expired');
    expect(pipe.transform('RDE_FORCE_ACCEPTED')).toEqual('Deadline extension date approved');
    expect(pipe.transform('RDE_SUBMITTED')).toEqual('Deadline extension date requested');

    expect(pipe.transform('RFI_CANCELLED')).toEqual('Request for information withdrawn');
    expect(pipe.transform('RFI_EXPIRED')).toEqual('Request for information expired');
    expect(pipe.transform('RFI_RESPONSE_SUBMITTED')).toEqual('Request for information responded');
    expect(pipe.transform('RFI_SUBMITTED')).toEqual('Request for information sent');
    expect(pipe.transform('REQUEST_TERMINATED')).toEqual('Workflow terminated by the system');

    expect(pipe.transform('ACTION_PLAN_P3_APPLICATION_RE_INITIATED')).toEqual('Action Plan returned for changes');
    expect(pipe.transform('ACTION_PLAN_P3_APPLICATION_SUBMITTED')).toEqual('Action Plan submitted');
    expect(pipe.transform('ACTION_PLAN_APPLICATION_CANCELLED')).toEqual('Action Plan cancelled');

    expect(pipe.transform('ACCOUNT_CLOSURE_APPLICATION_SUBMITTED')).toEqual('Account closed');
    expect(pipe.transform('ACCOUNT_CLOSURE_APPLICATION_CANCELLED')).toEqual('Account closure task cancelled');

    expect(pipe.transform('PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED')).toEqual('Progress Update 1 submitted');
    expect(pipe.transform('PROGRESS_UPDATE_1_P3_APPLICATION_RE_INITIATED')).toEqual(
      'Progress Update 1 returned for changes',
    );
    expect(pipe.transform('PROGRESS_UPDATE_1_APPLICATION_CANCELLED')).toEqual('Progress Update 1 cancelled');
    expect(pipe.transform('PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED')).toEqual('Progress Update 2 submitted');
    expect(pipe.transform('PROGRESS_UPDATE_2_P3_APPLICATION_RE_INITIATED')).toEqual(
      'Progress Update 2 returned for changes',
    );
    expect(pipe.transform('PROGRESS_UPDATE_2_APPLICATION_CANCELLED')).toEqual('Progress Update 2 cancelled');

    expect(pipe.transform(undefined)).toEqual('Approved Application');
  });
});
