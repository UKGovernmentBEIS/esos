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
import { LegalEntityDTO } from './legalEntityDTO';
import { LocationDTO } from './locationDTO';
import { RequestTaskActionPayload } from './requestTaskActionPayload';

export interface InstallationAccountOpeningAmendApplicationRequestTaskActionPayload extends RequestTaskActionPayload {
  accountType: 'INSTALLATION' | 'AVIATION' | 'ORGANISATION';
  applicationType: 'NEW_PERMIT' | 'TRANSFER';
  name: string;
  siteName: string;
  emissionTradingScheme: 'UK_ETS_INSTALLATIONS' | 'EU_ETS_INSTALLATIONS' | 'UK_ETS_AVIATION' | 'CORSIA';
  competentAuthority: 'ENGLAND' | 'NORTHERN_IRELAND' | 'OPRED' | 'SCOTLAND' | 'WALES';
  commencementDate: string;
  legalEntity: LegalEntityDTO;
  location: LocationDTO;
}
