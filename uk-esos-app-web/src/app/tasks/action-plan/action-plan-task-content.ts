import { Injector } from '@angular/core';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { RequestTaskPageContentFactory } from '@common/request-task/request-task.types';
import { PhasesPipe } from '@shared/pipes/phases.pipe';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ActionPlanP3, ActionPlanP3RequestMetadata, EnergyEfficiencyMeasure, RequestTaskDTO } from 'esos-api';

import { actionPlanQuery } from './+state/action-plan.selectors';
import { ActionPlanTaskPayload } from './action-plan.types';
import { ActionPlanSubmissionTaskButtonsComponent } from './components';
import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from './subtasks/energy-efficiency-measures/energy-efficiency-measures.helper';
import {
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from './subtasks/responsible-officer-confirmation/responsible-officer-confirmation.helper';

const routePrefix = 'action-plan';

export const actionPlanTaskContent: RequestTaskPageContentFactory = (injector: Injector) => {
  const store = injector.get(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const selectRequestMetadata = store.select(requestTaskQuery.selectRequestMetadata)();
  const payload = store.select(actionPlanQuery.selectPayload)();

  return {
    header: getHeader(requestTaskType, selectRequestMetadata),
    preContentComponent: getPreContentComponent(requestTaskType),
    sections: getSections(payload),
  };
};

export function isActionPlanCompleted(payload: ActionPlanTaskPayload): boolean {
  const subtaskNames = getSections(payload)
    .map((section) => section.tasks)
    .reduce((acc, subtasks) => [...acc, ...subtasks], [])
    .map((subtask) => subtask.name);

  return subtaskNames.every((subtask) => payload.actionPlanSectionsCompleted?.[subtask] === TaskItemStatus.COMPLETED);
}

export function hasOtherEstimationMethod(energyEfficiencyMeasures: EnergyEfficiencyMeasure[]): boolean {
  return !!energyEfficiencyMeasures?.some(
    (measure) => measure.energySavingsEstimateCalculatedType === 'OTHER_REASONABLE_ESTIMATION_METHOD',
  );
}

const getSections = (payload: ActionPlanTaskPayload) => {
  return [
    {
      title: '1. Prepare Action Plan',
      tasks: [
        {
          name: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
          status: getStatusForSubtask(payload, ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME),
          linkText: ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
          link: `${routePrefix}/${ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH}`,
        },
      ],
    },
    {
      title: '2. Confirm',
      tasks: [
        {
          name: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
          status: getStatusForSubtask(payload, RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME),
          linkText: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
          link: `${routePrefix}/${RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH}`,
        },
      ],
    },
  ];
};

const getHeader = (requestTaskType: RequestTaskDTO['type'], metadata: ActionPlanP3RequestMetadata): string => {
  const phasePipe = new PhasesPipe();

  switch (requestTaskType) {
    case 'ACTION_PLAN_P3_APPLICATION_SUBMIT':
      return `Submit ${phasePipe.transform(metadata.phase)} Action Plan`;
  }
};

const getPreContentComponent = (requestTaskType: RequestTaskDTO['type']) => {
  switch (requestTaskType) {
    case 'ACTION_PLAN_P3_APPLICATION_SUBMIT':
      return ActionPlanSubmissionTaskButtonsComponent;
  }
};

const getStatusForSubtask = (payload: ActionPlanTaskPayload, subtask: keyof ActionPlanP3): TaskItemStatus => {
  const completedSections = payload.actionPlanSectionsCompleted || {};
  if (
    subtask === RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME &&
    completedSections[ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME] !== TaskItemStatus.COMPLETED
  ) {
    return completedSections[subtask] && payload.actionPlanP3?.responsibleOfficerConfirmation?.length
      ? (completedSections[subtask] as TaskItemStatus)
      : TaskItemStatus.CANNOT_START_YET;
  }
  return (completedSections[subtask] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED;
};
