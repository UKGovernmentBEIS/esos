import { PhasesPipe } from '@shared/pipes/phases.pipe';

import { NotificationOfComplianceP3RequestMetadata, RequestTaskDTO } from 'esos-api';

import {
  NotificationReturnToSubmitTaskButtonsComponent,
  NotificationSubmissionTaskButtonsComponent,
} from './components';

export const getNotificationHeader = (
  requestTaskType: RequestTaskDTO['type'],
  metadata: NotificationOfComplianceP3RequestMetadata,
): string => {
  const phasePipe = new PhasesPipe();

  switch (requestTaskType) {
    case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT':
      return `Submit ${phasePipe.transform(metadata.phase)} notification`;

    case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT':
      return `Review ${phasePipe.transform(metadata.phase)} notification`;
  }
};

export const getPreContentComponent = (requestTaskType: RequestTaskDTO['type']) => {
  switch (requestTaskType) {
    case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT':
      return NotificationSubmissionTaskButtonsComponent;

    case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT':
      return NotificationReturnToSubmitTaskButtonsComponent;
  }
};
