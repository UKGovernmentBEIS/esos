import { SideEffect } from '@common/forms/side-effects/side-effect';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

import { ENERGY_SAVINGS_ACHIEVED_SUB_TASK } from './energy-savings-achieved.helper';

export class EnergySavingsAchievedSideEffect extends SideEffect {
  override subtask = ENERGY_SAVINGS_ACHIEVED_SUB_TASK;

  apply<T extends NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload>(currentPayload: T): T {
    return produce(currentPayload, (payload) => {
      const energySavingsAchieved = this.store.select(notificationQuery.selectEnergySavingsAchieved)();

      if (['NO', 'SKIP_QUESTION'].includes(energySavingsAchieved?.energySavingCategoriesExist)) {
        delete payload?.noc?.energySavingsAchieved?.energySavingsCategories;
      }

      if (['NO', 'SKIP_QUESTION'].includes(energySavingsAchieved?.energySavingsRecommendationsExist)) {
        delete payload?.noc?.energySavingsAchieved?.energySavingsRecommendations;
      }
    });
  }
}
