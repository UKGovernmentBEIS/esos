import { Injector } from '@angular/core';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { RequestTaskPageContentFactory } from '@common/request-task/request-task.types';
import { PhasesPipe } from '@shared/pipes/phases.pipe';
import {
  PU_GROUP_CHANGE_SUBTASK_NAME,
  PU_GROUP_CHANGE_SUBTASK_PATH,
  PU_GROUP_CHANGE_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-group-change/pu-group-change.helper';
import {
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ProgressUpdate2P3, ProgressUpdate2P3RequestMetadata } from 'esos-api';

import { progressUpdate2Query } from './+state/progress-update-2.selectors';
import { ProgressUpdate2SubmissionTaskButtonsComponent } from './components';
import { ProgressUpdate2TaskPayload } from './progress-update-2.types';
import {
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from './subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures.helper';

export const PU2_ROUTE_PATH = 'progress-update-2';

export const progressUpdate2TaskContent: RequestTaskPageContentFactory = (injector: Injector) => {
  const store = injector.get(RequestTaskStore);
  const selectRequestMetadata = store.select(
    requestTaskQuery.selectRequestMetadata,
  )() as ProgressUpdate2P3RequestMetadata;
  const payload = store.select(progressUpdate2Query.selectPayload)();
  const phasePipe = new PhasesPipe();

  return {
    header: `Submit ${phasePipe.transform(selectRequestMetadata.phase)} Progress Update 2`,
    preContentComponent: ProgressUpdate2SubmissionTaskButtonsComponent,
    sections: getSections(payload),
  };
};

export function isProgressUpdate2Completed(payload: ProgressUpdate2TaskPayload): boolean {
  const subtaskNames = getSections(payload)
    .map((section) => section.tasks)
    .reduce((acc, subtasks) => [...acc, ...subtasks], [])
    .map((subtask) => subtask.name);

  return subtaskNames.every(
    (subtask) => payload.progressUpdate2P3SectionsCompleted?.[subtask] === TaskItemStatus.COMPLETED,
  );
}

const getSections = (payload: ProgressUpdate2TaskPayload) => {
  const commonSections = [
    {
      title: (payload.isDisaggregateUndertaking ? '2' : '1') + '. Prepare Progress Update',
      tasks: [
        {
          name: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
          status: getStatusForSubtask(payload, PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME),
          linkText: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
          link: `${PU2_ROUTE_PATH}/${PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH}`,
        },
      ],
    },
    {
      title: (payload.isDisaggregateUndertaking ? '3' : '2') + '. Confirm',
      tasks: [
        {
          name: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
          status: getStatusForSubtask(payload, PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME),
          linkText: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
          link: `${PU2_ROUTE_PATH}/${PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH}`,
        },
      ],
    },
  ];

  return payload.isDisaggregateUndertaking
    ? [
        {
          title: '1. Enter information about a change of group',
          tasks: [
            {
              name: PU_GROUP_CHANGE_SUBTASK_NAME,
              status: getStatusForSubtask(payload, PU_GROUP_CHANGE_SUBTASK_NAME),
              linkText: PU_GROUP_CHANGE_SUBTASK_TITLE,
              link: `${PU2_ROUTE_PATH}/${PU_GROUP_CHANGE_SUBTASK_PATH}`,
            },
          ],
        },
        ...commonSections,
      ]
    : commonSections;
};

const getStatusForSubtask = (payload: ProgressUpdate2TaskPayload, subtask: keyof ProgressUpdate2P3): TaskItemStatus => {
  const completedSections = payload?.progressUpdate2P3SectionsCompleted || {};
  if (
    subtask === PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME &&
    completedSections[PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME] !== TaskItemStatus.COMPLETED
  ) {
    return completedSections[subtask] && payload?.progressUpdate2P3?.responsibleOfficerConfirmation?.length
      ? (completedSections[subtask] as TaskItemStatus)
      : TaskItemStatus.CANNOT_START_YET;
  }
  return (completedSections[subtask] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED;
};
