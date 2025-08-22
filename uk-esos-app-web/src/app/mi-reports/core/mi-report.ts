import { GovukTableColumn } from 'govuk-components';

import { MiReportResult } from 'esos-api';

export const pageSize = 20;

export const miReportTypeDescriptionMap: Partial<Record<MiReportResult['reportType'], string>> = {
  LIST_OF_ACCOUNTS_USERS_CONTACTS: 'List of Accounts, Users and Contacts',
  CUSTOM: 'Custom SQL report',
  NOC_SUBMITTED_DATA_P3: 'NOC Submitted Data - Phase 3',
  ACTION_PLAN_SUBMITTED_DATA_P3: 'Action Plan Published Data - Phase 3',
  PROGRESS_UPDATE_1_SUBMITTED_DATA_P3: 'Progress Update 1 Published Data - Phase 3',
  PROGRESS_UPDATE_2_SUBMITTED_DATA_P3: 'Progress Update 2 Published Data - Phase 3',
};

export const miReportTypeLinkMap: Partial<Record<MiReportResult['reportType'], string[]>> = {
  LIST_OF_ACCOUNTS_USERS_CONTACTS: ['./', 'accounts-users-contacts'],
  CUSTOM: ['./', 'custom'],
  NOC_SUBMITTED_DATA_P3: ['./', 'submitted-nocs'],
  ACTION_PLAN_SUBMITTED_DATA_P3: ['./', 'action-plan-published-data'],
  PROGRESS_UPDATE_1_SUBMITTED_DATA_P3: ['./', 'progress-update-1-published-data'],
  PROGRESS_UPDATE_2_SUBMITTED_DATA_P3: ['./', 'progress-update-2-published-data'],
};

export const createTablePage = (currentPage: number, pageSize: number, data: any[]): any[] => {
  const firstIndex = (currentPage - 1) * pageSize;
  const lastIndex = Math.min(firstIndex + pageSize, data?.length);

  return data?.length > firstIndex ? data.slice(firstIndex, lastIndex) : [];
};

export const createTableColumns = (columns: string[]): GovukTableColumn<any>[] => {
  return columns.map((column) => ({ field: column, header: column }));
};
