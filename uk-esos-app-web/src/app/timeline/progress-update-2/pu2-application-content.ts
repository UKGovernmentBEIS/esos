import { requestActionQuery, RequestActionStore } from '@common/request-action/+state';
import { RequestActionPageContentFactory } from '@common/request-action/request-action.types';
import { ItemActionTypePipe } from '@shared/pipes/item-action-type.pipe';
import {
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures.helper';
import {
  PU_GROUP_CHANGE_SUBTASK_PATH,
  PU_GROUP_CHANGE_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-group-change';
import {
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

import { progressUpdate2ApplicationTimelineQuery } from './+state/pu2-application.selectors';

export const PU2_ROUTE_PREFIX = 'progress-update-2';

export const progressUpdate2ApplicationSubmitted: RequestActionPageContentFactory = (injector) => {
  const store = injector.get(RequestActionStore);
  const pipe = new ItemActionTypePipe();
  const action = store.select(requestActionQuery.selectActionType)();
  const isDisaggregateUndertaking = store.select(
    progressUpdate2ApplicationTimelineQuery.selectIsDisaggregateUndertaking,
  )();

  const commonSections = [
    {
      title: (isDisaggregateUndertaking ? '2' : '1') + '. Prepare Progress Update',
      tasks: [
        {
          status: '',
          linkText: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
          link: `${PU2_ROUTE_PREFIX}/${PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH}`,
        },
      ],
    },
    {
      title: (isDisaggregateUndertaking ? '3' : '2') + '. Confirm',
      tasks: [
        {
          status: '',
          linkText: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
          link: `${PU2_ROUTE_PREFIX}/${PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH}`,
        },
      ],
    },
  ];

  return {
    header: pipe.transform(action),
    sections: isDisaggregateUndertaking
      ? [
          {
            title: '1. Enter information about a change of group',
            tasks: [
              {
                status: '',
                linkText: PU_GROUP_CHANGE_SUBTASK_TITLE,
                link: `${PU2_ROUTE_PREFIX}/${PU_GROUP_CHANGE_SUBTASK_PATH}`,
              },
            ],
          },
          ...commonSections,
        ]
      : commonSections,
  };
};
