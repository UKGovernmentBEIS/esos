import { Injector } from '@angular/core';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { RequestTaskPageContentFactory } from '@common/request-task/request-task.types';
import { PhasesPipe } from '@shared/pipes/phases.pipe';
import {
  PU_GROUP_CHANGE_SUBTASK_NAME,
  PU_GROUP_CHANGE_SUBTASK_PATH,
  PU_GROUP_CHANGE_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-group-change';
import {
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ProgressUpdate1P3, ProgressUpdate1P3RequestMetadata } from 'esos-api';

import { progressUpdate1Query } from './+state/progress-update-1.selectors';
import { ProgressUpdate1SubmissionTaskButtonsComponent } from './components';
import { ProgressUpdate1TaskPayload } from './progress-update-1.types';
import {
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from './subtasks/pu1-energy-efficiency-measures/pu1-energy-efficiency-measures.helper';

export const PU1_ROUTE_PATH = 'progress-update-1';

export const progressUpdate1TaskContent: RequestTaskPageContentFactory = (injector: Injector) => {
  const store = injector.get(RequestTaskStore);
  const selectRequestMetadata = store.select(
    requestTaskQuery.selectRequestMetadata,
  )() as ProgressUpdate1P3RequestMetadata;
  const payload = store.select(progressUpdate1Query.selectPayload)();
  const phasePipe = new PhasesPipe();

  return {
    header: `Submit ${phasePipe.transform(selectRequestMetadata.phase)} Progress Update 1`,
    preContentComponent: ProgressUpdate1SubmissionTaskButtonsComponent,
    sections: getSections(payload),
  };
};

export function isProgressUpdate1Completed(payload: ProgressUpdate1TaskPayload): boolean {
  const subtaskNames = getSections(payload)
    .map((section) => section.tasks)
    .reduce((acc, subtasks) => [...acc, ...subtasks], [])
    .map((subtask) => subtask.name);

  return subtaskNames.every(
    (subtask) => payload.progressUpdate1P3SectionsCompleted?.[subtask] === TaskItemStatus.COMPLETED,
  );
}

const getSections = (payload: ProgressUpdate1TaskPayload) => {
  const commonSections = [
    {
      title: (payload.isDisaggregateUndertaking ? '2' : '1') + '. Prepare Progress Update',
      tasks: [
        {
          name: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
          status: getStatusForSubtask(payload, PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME),
          linkText: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
          link: `${PU1_ROUTE_PATH}/${PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH}`,
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
          link: `${PU1_ROUTE_PATH}/${PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH}`,
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
              link: `${PU1_ROUTE_PATH}/${PU_GROUP_CHANGE_SUBTASK_PATH}`,
            },
          ],
        },
        ...commonSections,
      ]
    : commonSections;
};

const getStatusForSubtask = (payload: ProgressUpdate1TaskPayload, subtask: keyof ProgressUpdate1P3): TaskItemStatus => {
  const completedSections = payload?.progressUpdate1P3SectionsCompleted || {};
  if (
    subtask === PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME &&
    completedSections[PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME] !== TaskItemStatus.COMPLETED
  ) {
    return completedSections[subtask] && payload?.progressUpdate1P3?.responsibleOfficerConfirmation?.length
      ? (completedSections[subtask] as TaskItemStatus)
      : TaskItemStatus.CANNOT_START_YET;
  }
  return (completedSections[subtask] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED;
};
