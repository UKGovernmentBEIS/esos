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

export interface InstallationAccountDTO {
  id?: number;
  accountType: 'INSTALLATION' | 'AVIATION' | 'ORGANISATION';
  name: string;
  emissionTradingScheme: 'UK_ETS_INSTALLATIONS' | 'EU_ETS_INSTALLATIONS' | 'UK_ETS_AVIATION' | 'CORSIA';
  competentAuthority: 'ENGLAND' | 'NORTHERN_IRELAND' | 'OPRED' | 'SCOTLAND' | 'WALES';
  commencementDate: string;
  legalEntity?: LegalEntityDTO;
  location?: LocationDTO;
  acceptedDate?: string;
  sopId?: number;
  registryId?: number;
  status?:
    | 'UNAPPROVED'
    | 'DENIED'
    | 'NEW'
    | 'LIVE'
    | 'DEEMED_WITHDRAWN'
    | 'PERMIT_REFUSED'
    | 'AWAITING_SURRENDER'
    | 'SURRENDERED'
    | 'AWAITING_REVOCATION'
    | 'REVOKED'
    | 'AWAITING_TRANSFER'
    | 'TRANSFERRED';
  siteName: string;
  emitterType?: 'GHGE' | 'HSE';
  installationCategory?: 'A_LOW_EMITTER' | 'A' | 'B' | 'C' | 'N_A';
  applicationType?: 'NEW_PERMIT' | 'TRANSFER';
  transferCode?: string;
  subsistenceCategory?: 'A' | 'B' | 'C' | 'H' | 'S' | 'O' | 'Z';
  faStatus?: boolean;
}
