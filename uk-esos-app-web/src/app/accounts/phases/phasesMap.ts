import { RequestDetailsDTO } from 'esos-api';

export const phasesTypesMap: Record<string, Record<string, RequestDetailsDTO['requestType'][]>> = {
  ORGANISATION: {},
};

export const phasesStatusesMap: Record<string, Partial<Record<RequestDetailsDTO['requestStatus'], string>>> = {
  ORGANISATION: {
    APPROVED: 'Approved',
    CANCELLED: 'Cancelled',
    CLOSED: 'Closed',
    COMPLETED: 'Completed',
    IN_PROGRESS: 'In Progress',
    REJECTED: 'Rejected',
    TERMINATED: 'Terminated',
  },
};

export const phasesStatusesTagMap: Partial<Record<RequestDetailsDTO['requestStatus'], string>> = {
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CLOSED: 'CLOSED',
  TERMINATED: 'TERMINATED',
};
