import { requestActionQuery, RequestActionStore } from '@common/request-action/+state';
import { RequestActionPageContentFactory } from '@common/request-action/request-action.types';
import { ItemActionTypePipe } from '@shared/pipes/item-action-type.pipe';
import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '@tasks/action-plan/subtasks/energy-efficiency-measures/energy-efficiency-measures.helper';
import {
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '@tasks/action-plan/subtasks/responsible-officer-confirmation/responsible-officer-confirmation.helper';

const routePrefix = 'action-plan';

export const actionPlanApplicationSubmitted: RequestActionPageContentFactory = (injector) => {
  const pipe = new ItemActionTypePipe();
  const action = injector.get(RequestActionStore).select(requestActionQuery.selectActionType)();

  return {
    header: pipe.transform(action),
    sections: [
      {
        title: '1. Prepare Action Plan',
        tasks: [
          {
            status: '',
            linkText: ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
            link: `${routePrefix}/${ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH}`,
          },
        ],
      },
      {
        title: '2. Confirm',
        tasks: [
          {
            status: '',
            linkText: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
            link: `${routePrefix}/${RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH}`,
          },
        ],
      },
    ],
  };
};
