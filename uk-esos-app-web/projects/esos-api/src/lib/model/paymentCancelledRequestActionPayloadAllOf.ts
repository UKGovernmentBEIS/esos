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

export interface PaymentCancelledRequestActionPayloadAllOf {
  status?: 'MARK_AS_PAID' | 'MARK_AS_RECEIVED' | 'COMPLETED' | 'CANCELLED';
  cancellationReason?: string;
}
