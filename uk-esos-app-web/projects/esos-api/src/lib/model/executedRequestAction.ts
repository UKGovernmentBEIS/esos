/**
 * ESOS API Documentation
 * ESOS API Documentation
 *
 * The version of the OpenAPI document: uk-esos-app-api 0.81.0-SNAPSHOT
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export interface ExecutedRequestAction {
  Account_ID?: string;
  Account_type?: 'ORGANISATION';
  Account_name?: string;
  Account_status?: string;
  Workflow_ID?: string;
  Workflow_type?: 'ORGANISATION_ACCOUNT_OPENING' | 'NOTIFICATION_OF_COMPLIANCE_P3';
  Workflow_status?:
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'WITHDRAWN'
    | 'APPROVED'
    | 'REJECTED'
    | 'CLOSED'
    | 'EXEMPT';
  Timeline_event_type?:
    | 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED'
    | 'ORGANISATION_ACCOUNT_OPENING_APPROVED'
    | 'ORGANISATION_ACCOUNT_OPENING_REJECTED'
    | 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT'
    | 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED'
    | 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT'
    | 'RFI_SUBMITTED'
    | 'RFI_CANCELLED'
    | 'RFI_EXPIRED'
    | 'RFI_RESPONSE_SUBMITTED'
    | 'RDE_SUBMITTED'
    | 'RDE_ACCEPTED'
    | 'RDE_REJECTED'
    | 'RDE_FORCE_ACCEPTED'
    | 'RDE_FORCE_REJECTED'
    | 'RDE_EXPIRED'
    | 'RDE_CANCELLED'
    | 'PAYMENT_MARKED_AS_PAID'
    | 'PAYMENT_MARKED_AS_RECEIVED'
    | 'PAYMENT_COMPLETED'
    | 'PAYMENT_CANCELLED'
    | 'REQUEST_TERMINATED'
    | 'VERIFICATION_STATEMENT_CANCELLED';
  Timeline_event_Completed_by?: string;
  Timeline_event_Date_Completed?: string;
}
