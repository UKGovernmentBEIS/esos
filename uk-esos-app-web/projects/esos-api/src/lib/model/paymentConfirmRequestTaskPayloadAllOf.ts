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

export interface PaymentConfirmRequestTaskPayloadAllOf {
  paymentRefNum?: string;
  paymentDate?: string;
  paidByFullName?: string;
  amount?: string;
  status?: 'MARK_AS_PAID' | 'MARK_AS_RECEIVED' | 'COMPLETED' | 'CANCELLED';
  paymentMethod?: 'BANK_TRANSFER' | 'CREDIT_OR_DEBIT_CARD';
}
