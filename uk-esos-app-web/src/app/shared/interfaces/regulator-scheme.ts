import { OrganisationAccountDTO } from 'esos-api';

export const regulatorSchemeMap: Record<OrganisationAccountDTO['competentAuthority'], string> = {
  ENGLAND: 'England',
  WALES: 'Wales',
  SCOTLAND: 'Scotland',
  NORTHERN_IRELAND: 'Northern Ireland',
  OPRED: 'Offshore (i.e. operated by OPRED)',
};
