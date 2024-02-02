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

export interface OrganisationAccountOpeningAmendApplicationRequestTaskActionPayloadAllOf {
  registrationNumber?: string;
  name?: string;
  competentAuthority?: 'ENGLAND' | 'NORTHERN_IRELAND' | 'OPRED' | 'SCOTLAND' | 'WALES';
  line1?: string;
  line2?: string;
  city?: string;
  county?: string;
  postcode?: string;
}