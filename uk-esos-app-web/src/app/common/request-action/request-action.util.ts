import { RequestActionDTO } from 'esos-api';

import { NocReportComponent } from './reports/noc-report/noc-report.component';

export const reportableRequestActionTypes: RequestActionDTO['type'][] = [
  'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED',
];

export const reportComponentRequestActionTypes: {
  reportComponent: any;
  requestActionTypes: RequestActionDTO['type'][];
}[] = [{ reportComponent: NocReportComponent, requestActionTypes: reportableRequestActionTypes }];
