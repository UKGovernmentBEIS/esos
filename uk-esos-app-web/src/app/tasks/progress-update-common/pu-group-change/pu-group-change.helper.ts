import { GroupChange } from 'esos-api';

export enum ProgressUpdateGroupChangeStep {
  FORM = 'form',
  SUMMARY = 'summary',
}

export enum ProgressUpdateGroupChangeStepUrl {
  FORM = 'form',
  SUMMARY = '../',
}

export const PU_GROUP_CHANGE_SUBTASK_NAME = 'groupChange';

export const PU_GROUP_CHANGE_SUBTASK_TITLE = 'Group change';

export const PU_GROUP_CHANGE_SUBTASK_PATH = 'group-change';

export const isWizardCompleted = (groupChange: GroupChange): boolean => {
  return !!groupChange;
};
