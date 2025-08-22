import { Injector } from '@angular/core';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { RequestTaskPageContentFactory } from '@common/request-task/request-task.types';
import { TaskSection } from '@common/shared/model';
import { TaskItemStatus } from '@tasks/task-item-status';

import { NocP3 } from 'esos-api';

import { HIDDEN_SUBTASKS_MAP } from '../../requests/common/notification-application';
import { determineReportingObligationCategory } from '../../requests/common/reporting-obligation-category';
import { notificationQuery } from './+state/notification.selectors';
import { NotificationWaitForEditComponent } from './components';
import { getNotificationHeader, getPreContentComponent } from './notification.helper';
import { NotificationTaskPayload } from './notification.types';

const routePrefix = 'notification';

export const notificationTaskContent: RequestTaskPageContentFactory = (injector: Injector) => {
  const store = injector.get(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const selectRequestMetadata = store.select(requestTaskQuery.selectRequestMetadata)();

  return {
    header: getNotificationHeader(requestTaskType, selectRequestMetadata),
    preContentComponent: getPreContentComponent(requestTaskType),
    sections: [
      {
        title: 'Reporting obligation',
        tasks: [
          {
            name: 'reportingObligation',
            status: store.select(notificationQuery.selectStatusForSubtask('reportingObligation'))(),
            linkText: 'Reporting obligation',
            link: `${routePrefix}/reporting-obligation`,
          },
        ],
      },
      ...getVisibleSections(store.state.requestTaskItem?.requestTask?.payload),
    ],
  };
};

export const waitForEditTaskContent: RequestTaskPageContentFactory = () => {
  return {
    header: 'Awaiting external review of Phase 3 notification',
    contentComponent: NotificationWaitForEditComponent,
  };
};

export function isNocCompleted(payload: NotificationTaskPayload): boolean {
  return (
    getVisibleSections(payload)
      .map((section) => section.tasks)
      .reduce((acc, tasks) => [...acc, ...tasks], [])
      .map((task) => task.name)
      .every((task) => payload.nocSectionsCompleted[task] === 'COMPLETED') &&
    payload?.nocSectionsCompleted?.reportingObligation === 'COMPLETED'
  );
}

function getVisibleSections(payload: NotificationTaskPayload): TaskSection[] {
  const category = determineReportingObligationCategory(payload?.noc?.reportingObligation);

  if (!category) {
    return [];
  } else {
    return getAllSections(payload)
      .map((section) => ({
        ...section,
        tasks: section.tasks.filter((subtask) => {
          return !HIDDEN_SUBTASKS_MAP[category]
            .map((hs) => (typeof hs === 'string' ? hs : hs.isHidden(payload.noc) ? hs.subtask : null))
            .filter((hs) => !!hs)
            .includes(subtask.name as keyof NocP3);
        }),
      }))
      .filter((section) => section.tasks.length > 0);
  }
}

function getAllSections(payload: NotificationTaskPayload): TaskSection[] {
  return [
    {
      title: 'Organisation details',
      tasks: [
        {
          name: 'responsibleUndertaking',
          status: payload?.nocSectionsCompleted?.responsibleUndertaking ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Responsible undertaking',
          link: `${routePrefix}/responsible-undertaking`,
        },
        {
          name: 'contactPersons',
          status: payload?.nocSectionsCompleted?.contactPersons ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Contact persons',
          link: `${routePrefix}/contact-persons`,
        },
        {
          name: 'organisationStructure',
          status: payload?.nocSectionsCompleted?.organisationStructure ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Organisation structure',
          link: `${routePrefix}/organisation-structure`,
        },
      ],
    },
    {
      title: 'Information on energy use',
      tasks: [
        {
          name: 'complianceRoute',
          status: payload?.nocSectionsCompleted?.complianceRoute ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Compliance route',
          link: `${routePrefix}/compliance-route`,
        },
        {
          name: 'energyConsumptionDetails',
          status: payload?.nocSectionsCompleted?.energyConsumptionDetails ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Energy consumption',
          link: `${routePrefix}/energy-consumption`,
        },
        {
          name: 'energySavingsOpportunities',
          status: payload?.nocSectionsCompleted?.energySavingsOpportunities ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Energy savings opportunities',
          link: `${routePrefix}/energy-savings-opportunities`,
        },
        {
          name: 'alternativeComplianceRoutes',
          status: payload?.nocSectionsCompleted?.alternativeComplianceRoutes ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Alternative routes to compliance',
          link: `${routePrefix}/alternative-compliance-routes`,
        },
        {
          name: 'energySavingsAchieved',
          status: payload?.nocSectionsCompleted?.energySavingsAchieved ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Energy savings achieved',
          link: `${routePrefix}/energy-savings-achieved`,
        },
      ],
    },
    {
      title: 'Energy assessment contact',
      tasks: [
        {
          name: 'leadAssessor',
          status: payload?.nocSectionsCompleted?.leadAssessor ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Lead assessor details',
          link: `${routePrefix}/lead-assessor-details`,
        },
        {
          name: 'assessmentPersonnel',
          status: payload?.nocSectionsCompleted?.assessmentPersonnel ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Assessment personnel',
          link: `${routePrefix}/assessment-personnel`,
        },
      ],
    },
    {
      title: 'Previous compliance periods',
      tasks: [
        {
          name: 'secondCompliancePeriod',
          status: payload?.nocSectionsCompleted?.secondCompliancePeriod ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Second compliance period',
          link: `${routePrefix}/second-compliance-period`,
        },
        {
          name: 'firstCompliancePeriod',
          status: payload?.nocSectionsCompleted?.firstCompliancePeriod ?? TaskItemStatus.NOT_STARTED,
          linkText: 'First compliance period',
          link: `${routePrefix}/first-compliance-period`,
        },
      ],
    },
    {
      title: 'Confirmation',
      tasks: [
        {
          name: 'confirmations',
          status: payload?.nocSectionsCompleted?.confirmations ?? TaskItemStatus.NOT_STARTED,
          linkText: 'Responsible officer confirmation',
          link: `${routePrefix}/confirmation`,
        },
      ],
    },
  ];
}
