import { OrganisationAccountDTO } from 'esos-api';

export function accountFinalStatuses(status: OrganisationAccountDTO['status']): boolean {
  return status !== 'AWAITING_APPROVAL' && status !== 'DENIED';
}
